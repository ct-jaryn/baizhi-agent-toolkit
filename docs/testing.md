# Validation scope

Tests distinguish metadata validation, client behavior and live service behavior. Passing one does not establish the others.

## Reproducible checks

```sh
node --test tests/*.test.mjs
mcp-publisher validate server.json
```

The Node tests use dummy values only. The official Publisher validator can contact the official Registry to validate the public metadata; it receives no API key. Public CI does not call paid Baizhi Cloud tools.

Before a release, also run each marketplace's own validator/generator and compare generated entries with the intended source. Validate the extension using the supported Gemini CLI version and its real settings/connection code in an isolated test environment.

## Release checks

- Confirm the URL and authentication mechanism agree across manifests.
- Confirm no real credentials, access tokens or session files appear in Git history or release archives.
- Verify missing or invalid keys do not become an unauthenticated success claim.
- Check that required secret prompts and template expansion actually work in each target client, not only in our own test code.
- Distinguish mock-server checks from authenticated tests against the hosted service.
- Record client version, selected tools, connection result and any untested platforms.
- Never claim all tools or all clients were tested on the basis of a single MCP handshake.

The service's unauthenticated initialization endpoint returned HTTP 401 during the 2026-09-16 integration work. A previous same-day Hermes-specific test discovered tools and called the three starting tools, but that is not an end-to-end test of Kilo, Cline or Gemini CLI.

Gemini CLI 0.60.0's actual installer, secret reload and HTTP transport passed isolated tests with a dummy credential and a local MCP fixture. See [the detailed evidence and reproduction steps](gemini-verification.md). Kilo's entry passed its three marketplace generators and template checks; its installer behavior was source-reviewed. Cline's entry passed the 203-entry catalog validation and six source-backed parser checks, which also established its missing native credential flow. None of these claims implies authenticated production testing in all three clients.
