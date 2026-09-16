# Publishing

The publisher namespace is `io.github.ct-jaryn/baizhi-agent-toolkit`, authenticated through the GitHub account that owns this repository. It is not a claim to a verified `baizhi.cloud` domain namespace.

`server.json` intentionally omits the optional backend `repository` field: this repository holds integration code, not the hosted backend. The public `websiteUrl` points here for installation and security information.

## Official MCP Registry

1. Review the manifest, service URL, secret placeholders, README and test results.
2. Run the official `mcp-publisher validate server.json` command.
3. Run the **Publish MCP Registry** workflow manually on `main` after reviewing that revision.
4. The workflow validates, obtains a short-lived GitHub OIDC token and publishes the manifest. It has no Baizhi Cloud API key and performs no tool calls.
5. Verify the returned entry using the Registry API. Record the actual published version and workflow run, not just a successful local schema check.

The manifest version tracks this integration release. Tool availability and the hosted server's implementation version can change independently.

Registry metadata is public and dedicated under the Registry's CC0 terms; it must never contain credentials. Publication is not certification or a guarantee that downstream clients immediately list the service. See the [Registry terms](https://modelcontextprotocol.io/registry/terms-of-service).

## Gemini CLI Gallery

Keep `gemini-extension.json` at the public repository root. Add the `gemini-cli-extension` GitHub topic after validating the extension. The official Gallery discovers repositories and validates them on its schedule. A public repository/topic is a submission mechanism, not proof that the Gallery has indexed the extension. See the [release guide](https://geminicli.com/docs/extensions/releasing/).

## Kilo and Cline

Submit narrowly scoped marketplace PRs with clear ownership, key requirements, pricing disclosure, installation instructions and test evidence. Keep certification flags unset. Do not claim live client testing that was not performed. Track submission, review and acceptance separately.
