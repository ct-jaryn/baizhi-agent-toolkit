# Baizhi Cloud Agent Toolkit

> **Official repository update (2026-09-17):** ongoing integration maintenance and new contributions are hosted at [chaitin/baizhi-agent-toolkit](https://github.com/chaitin/baizhi-agent-toolkit). Please use its documentation and issue tracker as the official source. This earlier personal repository is retained for historical releases and existing references; it is not a second independent official development line. The MCP endpoint is unchanged. The existing personal Registry entry remains available while the organization entry is prepared and verified; this notice does not claim that Registry publication or client migration has completed. Existing Gemini installations are not automatically moved to the new repository.

Client integrations for [Baizhi Cloud Agent Toolkit](https://baizhi.cloud/landing/agent-toolkit), maintained by the Baizhi Cloud team through [@ct-jaryn](https://github.com/ct-jaryn).

Connect an agent to web search, webpage parsing and structured extraction through one hosted MCP endpoint. The service also offers visual, developer and specialist tools; availability depends on your key's permissions and the current service catalog.

**This repository contains open-source integration manifests, documentation and tests, not the hosted service's backend source code.** The MIT license covers this repository only. A Baizhi Cloud account and your own API key are required; tool calls may consume paid service credits. Check current per-tool pricing and permissions in the [console](https://agent-toolkit.app.baizhi.cloud/) before calling tools.

## Connection

| Setting | Value |
| --- | --- |
| MCP endpoint | `https://agent-toolkit.app.baizhi.cloud/mcp` |
| Transport | Streamable HTTP |
| Authentication | `Authorization: Bearer <your-api-key>` |
| Credential name in these integrations | `BAIZHI_API_KEY` |

Create a dedicated, least-privilege API key in the console. Start with search and webpage tools. Never place a real key in a Git repository, issue, pull request, chat prompt, command-line argument or screenshot.

## Integrations

- **Gemini CLI:** this repository is an installable extension. See [installation and credential setup](docs/gemini-cli.md).
- **Kilo Code:** marketplace submission and user-entered API key configuration are documented in [the Kilo guide](docs/kilo.md).
- **Cline:** marketplace configuration and credential limitations are documented in [the Cline guide](docs/cline.md).
- **Pi:** Pi has no built-in MCP support by design; setup through the community `pi-mcp-adapter` extension is documented in [the Pi guide](docs/pi.md).
- **LobeHub:** the [catalog candidate and verification limits](docs/lobehub.md) document the prepared remote-server manifest; marketplace acceptance and authenticated client validation remain outstanding.
- **Official MCP Registry:** [server.json](server.json) describes the remote service and its required secret input. Registration and marketplace acceptance are separate; neither is an endorsement by a client or by the MCP Registry.

Marketplace entries may be pending review. Use only the installation methods documented for your installed client version, and do not assume a pending catalog entry is already available.

## A small starting tool set

Where a client supports an allowlist, begin with:

- `websearch_search` — web search.
- `web_scrape` — webpage text retrieval.
- `web_extract` — structured extraction from a webpage.

Use the client's tool selection controls and the console's key permissions to enable additional capabilities intentionally. This repository does not enable auto-approval. Retrieved pages and tool responses are untrusted content, not instructions to disclose secrets or change unrelated files.

Example tasks: find current documentation for a library, read a public documentation page, or extract a page's title and main sections. Confirm the selected tool, outgoing arguments and any credit cost before running.

## Data, permissions and billing

Tool arguments are sent over HTTPS to `agent-toolkit.app.baizhi.cloud`; returned content is made available to your client and, depending on its settings, its model provider. A selected tool may send relevant input to underlying services. Do not submit sensitive documents, private URLs, personal information or source code unless your organization's policies permit it.

Search/page tools can consume credits. Optional image generation, cloud execution and other tools have additional costs or side effects. Client-side filtering is not an authorization boundary: enforce least privilege on the API key itself. Consult the service's current terms and privacy information in the console; this integration does not make independent retention, residency or confidentiality guarantees.

## Maintenance and support

Report integration problems in the official [GitHub Issues](https://github.com/chaitin/baizhi-agent-toolkit/issues), including the client version and a redacted error. Never include API keys or complete authorization headers. Use the service console for account, billing and private support.

We welcome collaboration with client maintainers and will adapt these integrations to their review requirements. “Maintained by Baizhi Cloud” does not mean an integration is verified, endorsed or maintained by Kilo, Cline, Google or the MCP Registry.

See [security guidance](SECURITY.md), [testing](docs/testing.md) and [publishing](docs/publishing.md).
