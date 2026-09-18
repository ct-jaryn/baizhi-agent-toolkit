import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const json = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const endpoint = 'https://agent-toolkit.app.baizhi.cloud/mcp';

test('Registry publishes only the intended hosted endpoint', () => {
  const server = json('server.json');
  assert.equal(server.name, 'io.github.ct-jaryn/baizhi-agent-toolkit');
  assert.equal(server.version, '0.1.0');
  assert.equal(server.remotes.length, 1);
  assert.equal(server.remotes[0].type, 'streamable-http');
  assert.equal(server.remotes[0].url, endpoint);
  assert.equal(server.packages, undefined);
  // This is an integration repository, not the hosted backend's source.
  assert.equal(server.repository, undefined);
});

test('Registry asks for a required secret and never embeds a credential', () => {
  const header = json('server.json').remotes[0].headers[0];
  assert.equal(header.name, 'Authorization');
  assert.equal(header.value, 'Bearer {BAIZHI_API_KEY}');
  assert.equal(header.isRequired, true);
  assert.equal(header.isSecret, true);
  const input = header.variables.BAIZHI_API_KEY;
  assert.equal(input.isRequired, true);
  assert.equal(input.isSecret, true);
  assert.equal(input.default, undefined);
  assert.equal(input.value, undefined);
  // Prove prefixing is done by the template, not requested from the user.
  assert.equal(header.value.replace('{BAIZHI_API_KEY}', 'test-only'), 'Bearer test-only');
});

test('Gemini points at the same endpoint with a secret variable and bounded tools', () => {
  const extension = json('gemini-extension.json');
  assert.equal(extension.name, 'baizhi-agent-toolkit');
  assert.equal(extension.version, json('server.json').version);
  const servers = Object.values(extension.mcpServers);
  assert.equal(servers.length, 1);
  assert.equal(servers[0].httpUrl, endpoint);
  assert.equal(servers[0].headers.Authorization, 'Bearer ${BAIZHI_API_KEY}');
  assert.notEqual(servers[0].trust, true);
  assert.deepEqual([...servers[0].includeTools].sort(), ['web_extract', 'web_scrape', 'websearch_search']);
  const input = extension.settings.find((setting) => setting.envVar === 'BAIZHI_API_KEY');
  assert.equal(input.sensitive, true);
});

test('LobeHub plugin manifest matches the other clients', () => {
  const plugin = json('lhm.plugin.json');
  assert.equal(plugin.identifier, 'baizhi-agent-toolkit');
  assert.equal(plugin.version, json('server.json').version);
  // Every client must expose the same capability set, no more and no less.
  const geminiTools = json('gemini-extension.json').mcpServers['baizhi-agent-toolkit'].includeTools;
  assert.deepEqual(plugin.tools.map((tool) => tool.name).sort(), [...geminiTools].sort());
  for (const tool of plugin.tools) {
    assert.equal(tool.inputSchema.type, 'object');
    assert.ok(tool.inputSchema.required.length > 0, `${tool.name} must require at least one argument`);
    for (const name of tool.inputSchema.required) {
      assert.ok(tool.inputSchema.properties[name], `${tool.name} requires undeclared ${name}`);
    }
    for (const [name, property] of Object.entries(tool.inputSchema.properties)) {
      assert.ok(property.description, `${tool.name}.${name} needs a description`);
    }
  }
});

test('LobeHub manifest embeds no credential and names the hosted endpoint', () => {
  const raw = readFileSync(new URL('../lhm.plugin.json', import.meta.url), 'utf8');
  const plugin = JSON.parse(raw);
  // It documents the hosted service and asks the user for their own key.
  assert.match(plugin.description, /agent-toolkit\.app\.baizhi\.cloud\/mcp/);
  assert.match(plugin.description, /own Baizhi API key/);
  assert.match(plugin.description, /credits/);
  // No credential literal may be committed.
  assert.doesNotMatch(raw, /Bearer\s+[A-Za-z0-9._-]{8,}/);
  assert.doesNotMatch(raw, /"(?:api[_-]?key|token|secret)"\s*:\s*"(?!Bearer\s*\{)[^"]+"/i);
});
