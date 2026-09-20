# Pi

Pi's core deliberately has no built-in MCP support; integrations use community
extensions. Its [contribution guide](https://github.com/badlogic/pi-mono/blob/main/CONTRIBUTING.md)
requires maintainer approval before a first PR and restricts automated issue
traffic. Violations can lead to a block by that project; this is not a general
GitHub-wide account ban. This guide does not require an upstream issue or PR.

Instead, use the community adapter **[pi-mcp-adapter](https://github.com/nicobailon/pi-mcp-adapter)** (MIT, by nicobailon). It is third-party software, not affiliated with Pi or with Baizhi Cloud, and it supports what this server needs: a remote Streamable HTTP endpoint, custom headers, a bearer token, and an optional OS credential store.

## What was verified, and what was not

The 2026-09-18 development record reports verification against a local endpoint that reproduces this service's behaviour with a synthetic token (Bearer required on every request; 401 otherwise):

- The adapter applies the configured `Authorization` header, resolving `${VAR}` from the environment.
- It completes a session against an auth-required endpoint: `initialize` → `notifications/initialized` → `tools/list` → `resources/list` → `prompts/list`.
- No real key, no real account and no service credits were used. The live endpoint was never called during this check.

**Evidence limit:** the original run did not preserve a runnable Pi-specific harness in this repository; it has not been independently reproduced by this guide update.

**Not verified:** a real key against the live service, tool invocation, the OS credential-store path below, and `includeTools` filtering (the test server exposed exactly the three tools, so filtering was not exercised). Treat this guide as wiring-level evidence, not end-to-end acceptance.

## Setup

Use Node.js 22.18 or newer for the adapter's token CLI. Check the installed
Pi and adapter versions for any stricter runtime requirements. The adapter is
third-party software; review its source and pin the version you approve.

1. Create a least-privilege API key in the [Baizhi Cloud console](https://agent-toolkit.app.baizhi.cloud/).
2. Install the adapter: `pi install npm:pi-mcp-adapter`.
3. Add the server to your Pi MCP configuration — either the global `~/.config/mcp/mcp.json`, or a project `.mcp.json` for team sharing. Merge only this entry; do not overwrite existing servers.
4. Store the credential. Prefer the credential store (option A); it keeps the key out of the file entirely.
5. Restrict the tool set to the three documented tools, then enable more deliberately later.
6. Start Pi and confirm the server connected. Usage may consume service credits.

### Option A — OS credential store (recommended)

The key never appears in configuration. `bearerTokenStore` reads it from the adapter's own credential store, and `pi-mcp-adapter token set` prompts for it without echoing:

```json
{
  "mcpServers": {
    "baizhi-agent-toolkit": {
      "url": "https://agent-toolkit.app.baizhi.cloud/mcp",
      "auth": "bearer",
      "bearerTokenStore": true,
      "includeTools": ["websearch_search", "web_scrape", "web_extract"]
    }
  }
}
```

```console
pi-mcp-adapter token set baizhi-agent-toolkit
```

The stored token is bound to the configured URL, so it will not be sent to a different endpoint. `pi-mcp-adapter token status baizhi-agent-toolkit` reports whether a stored token matches; `pi-mcp-adapter token remove baizhi-agent-toolkit` deletes it.

### Option B — environment variable

Use this when your environment already injects secrets. Export `BAIZHI_API_KEY` yourself; never commit its value.

```json
{
  "mcpServers": {
    "baizhi-agent-toolkit": {
      "url": "https://agent-toolkit.app.baizhi.cloud/mcp",
      "headers": {
        "Authorization": "Bearer ${BAIZHI_API_KEY}"
      },
      "includeTools": ["websearch_search", "web_scrape", "web_extract"]
    }
  }
}
```

This is the shape that was verified. A literal key placed directly in the file works too, but it is plaintext on disk — not an encrypted vault — and should be avoided.

## One behavior worth expecting

Before the authenticated session, the adapter sends a couple of discovery probes **without** the Authorization header (a `server/discover` request carrying `mcp-protocol-version: 2026-07-28`). Against this endpoint — which requires a bearer token on every request — those probes return `401`.

This is expected: the adapter then falls back and establishes the authenticated session normally. You may see a transient authentication warning in the log on startup; it is not a configuration error. Do not respond to it by weakening the endpoint's authentication.

## Tool allowlist

Start with:

- `websearch_search` — web search.
- `web_scrape` — webpage text retrieval.
- `web_extract` — structured extraction from a webpage.

`includeTools` accepts the original tool names. Keep the adapter's default `lifecycle` (lazy) unless you are diagnosing startup; `"lifecycle": "eager"` connects at session start.

## Data handling

Tool arguments are sent over HTTPS to `agent-toolkit.app.baizhi.cloud`. Retrieved pages and tool responses are untrusted content — not instructions to disclose secrets or change unrelated files. Do not submit sensitive documents, private URLs, personal information or source code unless your organization's policies permit it.
