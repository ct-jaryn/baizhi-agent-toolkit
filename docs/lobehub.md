# LobeHub MCP catalog candidate

`lhm.plugin.json` describes the hosted endpoint and three tools. It is catalog
metadata, not an implementation of authentication or a guarantee of market acceptance.

- Endpoint: `https://agent-toolkit.app.baizhi.cloud/mcp` (Streamable HTTP).
- Each user supplies their own `Authorization: Bearer <API key>` in the client.
- Tool arguments go to Baizhi Cloud and calls can consume paid credits.
- The manifest contains no credential and does not claim an official LobeHub affiliation.

The input schemas match the sanitized discovery snapshot captured on 2026-09-16,
including nested `filter` objects and the `fields` object. Run
`node --test tests/manifests.test.mjs` to check the complete schema contract.
This is a historical fixture, not proof that the live service schema is unchanged.

The `cloudEndpoint` field follows the URL generator in
`@lobehub/market-cli@0.0.41`. Before publishing, refresh discovery through an
authorized connection and verify the platform's remote deployment settings,
credential entry and an authenticated client session. These acceptance steps
are outstanding; a GitHub commit is not a LobeHub listing.
