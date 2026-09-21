# Pi

Pi's core deliberately has no built-in MCP support; integrations use community
extensions. Its [contribution guide](https://github.com/earendil-works/pi/blob/main/CONTRIBUTING.md)
requires maintainer approval before a first PR and restricts automated issue
traffic. Violations can lead to a block by that project; this is not a general
GitHub-wide account ban. This guide does not require an upstream issue or PR.

Instead, use the community adapter **[pi-mcp-adapter](https://github.com/nicobailon/pi-mcp-adapter)** (MIT, by nicobailon). It is third-party software, not affiliated with Pi or with Baizhi Cloud, and it supports what this server needs: a remote Streamable HTTP endpoint, custom headers, a bearer token, and an optional OS credential store.

## Preview community package

The separate [pi-baizhi-toolkit package](https://github.com/ct-jaryn/pi-baizhi-toolkit)
is a preview providing a Baizhi research skill and a project configuration helper. It reuses
`pi-mcp-adapter`; it does not implement another MCP bridge or include a key.
See its README for pinned installation and offline reproduction commands.
The helper inspects only the current project's `.mcp.json`, not Pi's effective
merged configuration or a live account.

## What was verified, and what was not

The 2026-09-21 reproducible suite uses Pi `0.86.1`, adapter `2.35.0`, and Node
`22.22.2` on macOS. It exercises Pi's CLI package installation, resource loader,
extension binding, `session.prompt()` and actual agent tool dispatch. The model
stream and MCP server are synthetic, in an isolated HOME with only loopback
network access:

- Authenticated MCP initialization and tool discovery.
- Search, page reading and extraction with the exact nested tool arguments.
- A fourth tool excluded from listing and denied when explicitly requested.
- Missing and incorrect keys, HTTP errors, cancellation during a pending call,
  configuration disable/reload, and extension shutdown.

No real model API, Baizhi account, key or service credits are used. The older
2026-09-18 handshake record remains historical; the new repository supplies
runnable tests rather than relying on that narrative.

**Limits:** no live-service output or billing validation, OS credential-store
validation, manual TUI testing, or Windows/Linux/minimum-Node acceptance. The
adapter has unresolved credential-handling limitations in diagnostic paths.
The helper's local preflight is not a runtime fix. Treat this integration as a
preview, use a dedicated key with available restrictions, and review diagnostics before sharing
them. Do not assume errors are credential-free.

## Setup

The current documented combination is Pi `0.86.1`, `pi-mcp-adapter` `2.35.0`,
and Node.js `22.19.0` or newer. This is stricter than the adapter token CLI's
own minimum. The reproducible checks above ran on Node `22.22.2`; the minimum
is the declared package requirement, not a separately tested version. Review
the adapter source before installing it.

1. Create your own API key in the [Baizhi Cloud console](https://agent-toolkit.app.baizhi.cloud/); apply available account and key restrictions appropriate to your use.
2. Install the adapter: `pi install npm:pi-mcp-adapter@2.35.0`.
3. Add the server to your Pi MCP configuration — either the global `~/.config/mcp/mcp.json`, or a project `.mcp.json` for team sharing. Merge only this entry; do not overwrite existing servers.
4. Supply the credential through your environment (the tested option below), then run the package preflight. The OS credential store is an alternative not exercised by this suite.
5. Restrict the tool set to the three documented tools, then enable more deliberately later.
6. From the configured project, run `node /path/to/pi-baizhi-toolkit/bin/pi-baizhi.mjs check` using your reviewed package checkout before starting Pi. It checks local configuration and the current environment only. Then start Pi and confirm the server connected. Live usage may consume service credits.

### Tested configuration — environment variable

Use this when your environment already injects secrets. Export `BAIZHI_API_KEY` yourself; never commit its value.

```json
{
  "mcpServers": {
    "baizhi-agent-toolkit": {
      "url": "https://agent-toolkit.app.baizhi.cloud/mcp",
      "auth": "bearer",
      "bearerTokenEnv": "BAIZHI_API_KEY",
      "includeTools": ["websearch_search", "web_scrape", "web_extract"]
    }
  }
}
```

This is the configuration exercised by the community package. A literal key in
this file is plaintext on disk; keep the value in your user-managed environment.
The preflight does not validate your account, quota or effective merged Pi settings.

### Alternative — OS credential store (not exercised by this suite)

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

## One behavior worth expecting

Before the authenticated session, the adapter sends a couple of discovery probes **without** the Authorization header (a `server/discover` request carrying `mcp-protocol-version: 2026-07-28`). Against this endpoint — which requires a bearer token on every request — those probes return `401`.

This was observed in the historical adapter run: it then fell back and established the authenticated session. Discovery behavior is version-dependent. An anonymous probe returning 401 is distinct from an authenticated request failing; inspect that distinction before diagnosing configuration, and do not weaken endpoint authentication.

## Tool allowlist

Start with:

- `websearch_search` — web search.
- `web_scrape` — webpage text retrieval.
- `web_extract` — structured extraction from a webpage.

`includeTools` accepts the original tool names. Keep the adapter's default `lifecycle` (lazy) unless you are diagnosing startup; `"lifecycle": "eager"` connects at session start.

## Data handling

Tool arguments are sent over HTTPS to `agent-toolkit.app.baizhi.cloud`. Retrieved pages and tool responses are untrusted content — not instructions to disclose secrets or change unrelated files. Do not submit sensitive documents, private URLs, personal information or source code unless your organization's policies permit it.
