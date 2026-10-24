/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { createFakeClient, createMemoryPair, loadScenario, matchMessage, parseFixture, runScenario } from '../src/testing';
import type { Scenario } from '../src/testing';

const withLines = (name: string, text: string): Scenario => ({ ...loadScenario('lobby-info'), name, lines: parseFixture(text, name) });

const INFO = '{"type":"lobby.info","seq":1,"protocol":{"name":"archipelia-lobby","versions":[1]},"lobby":{"code":"K7QM-4XT2"}}';
const READY = '{"type":"ready","seq":1,"ready":true}';

const pairUp = (serverScenario: Scenario, clientScenario: Scenario, ignore: string[] = []) =>
  runScenario(serverScenario, { clientScenario, ignore, timeoutMs: 100 });

describe('the fakes fail on a script break', () => {
  test('the server fails on a message of the wrong type', async () => {
    const expected = withLines('a', `{"dir":"c2s","msg":${INFO}}`);
    const sent = withLines('b', `{"dir":"c2s","msg":${READY}}`);
    const run = await pairUp(expected, sent);
    expect(run.server.ok).toBe(false);
    expect(run.server.failure).toContain('line 1');
  });

  test('the server fails on a client message that breaks the schema', async () => {
    const broken = '{"type":"upload.begin","seq":1,"sha256":"nope","kind":"world","size":10}';
    const expected = withLines('a', `{"dir":"c2s","msg":${broken}}`);
    const sent = withLines('b', `{"dir":"c2s","msg":${broken},"invalid":true}`);
    const run = await pairUp(expected, sent);
    expect(run.server.ok).toBe(false);
    expect(run.server.failure).toContain('breaks the protocol');
  });

  test('the client fails on a server message that breaks the schema', async () => {
    const broken = '{"type":"slots.ok","re":1}';
    const sent = withLines('s', `{"dir":"s2c","msg":${broken},"invalid":true}`);
    const expected = withLines('c', `{"dir":"s2c","msg":${broken}}`);
    const run = await pairUp(sent, expected);
    expect(run.client.ok).toBe(false);
    expect(run.client.failure).toContain('breaks the protocol');
  });

  test('the client fails when the server stays silent', async () => {
    const silent = withLines('s', '');
    const waiting = withLines('c', '{"dir":"s2c","msg":{"type":"slots.ok","re":1,"need":[]}}');
    const run = await pairUp(silent, waiting);
    expect(run.client.ok).toBe(false);
    expect(run.client.failure).toMatch(/closed|timed out/);
  });

  test('the client fails on a wrong close code', async () => {
    const server = withLines('s', '{"dir":"close","code":4403}');
    const client = withLines('c', '{"dir":"close","code":4404}');
    const run = await pairUp(server, client);
    expect(run.client.failure).toContain('4404');
  });

});

describe('the fakes handle ignore lists and host lines', () => {
  test('the client skips message types on its ignore list', async () => {
    const state = '{"type":"slots.ok","re":1,"need":[]}';
    const progress = '{"type":"lobby.progress","phase":"generating","step":"generate","fraction":0.5}';
    const server = withLines('s', `{"dir":"s2c","msg":${state}}\n{"dir":"s2c","msg":${progress}}`);
    const client = withLines('c', `{"dir":"s2c","msg":${progress}}`);
    expect((await pairUp(server, client, ['slots.ok'])).client.ok).toBe(true);
    expect((await pairUp(server, client)).client.ok).toBe(false);
  });

  test('a host line reaches the hook with its placeholders resolved', async () => {
    const calls: unknown[] = [];
    const scenario = withLines('h', '{"dir":"host","action":"consent","world":"$U","allowed":true}');
    const client = createFakeClient({
      scenario,
      timeoutMs: 100,
      host: (line) => {
        calls.push(line);
        return Promise.resolve();
      },
      connect: () => Promise.resolve(createMemoryPair()[0]),
    });
    expect((await client.play()).ok).toBe(true);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({ action: 'consent', allowed: true });
    expect((calls[0] as { world: string }).world).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('message matching', () => {
  test('placeholders bind once and then must repeat', () => {
    const bindings = {};
    expect(matchMessage({ a: '$x', b: '$x' }, { a: 1, b: 1 }, bindings)).toBeNull();
    expect(matchMessage({ a: '$y', b: '$y' }, { a: 1, b: 2 }, {})).toContain('b');
  });

  test('extra fields in the actual message are ignored', () => {
    expect(matchMessage({ a: 1 }, { a: 1, extra: true }, {})).toBeNull();
  });

  test('a missing field is reported with its path', () => {
    expect(matchMessage({ a: { b: 1 } }, { a: {} }, {})).toContain('a.b');
  });

  test('wildcards check the kind of value', () => {
    expect(matchMessage({ n: '$any_int' }, { n: 3 }, {})).toBeNull();
    expect(matchMessage({ n: '$any_int' }, { n: 'three' }, {})).not.toBeNull();
    expect(matchMessage({ t: '$any_tls' }, { t: 'maybe' }, {})).not.toBeNull();
  });

  test('a has clause finds an entry in any position', () => {
    const expected = { list: [{ $has: { id: 'b' } }] };
    expect(matchMessage(expected, { list: [{ id: 'a' }, { id: 'b' }] }, {})).toBeNull();
    expect(matchMessage(expected, { list: [{ id: 'a' }] }, {})).toContain('no entry');
  });

  test('a list without has clauses must match in length', () => {
    expect(matchMessage({ list: [1, 2] }, { list: [1] }, {})).not.toBeNull();
  });
});

describe('fixture parsing', () => {
  test('repeat blocks expand into plain lines', () => {
    const lines = parseFixture('{"dir":"repeat","times":3,"lines":[{"dir":"connect"},{"dir":"close","code":4404}]}');
    expect(lines).toHaveLength(6);
  });

  test('an unknown direction is rejected with its line', () => {
    expect(() => parseFixture('{"dir":"sideways"}', 'x')).toThrow('x line 1');
  });

  test('a line that is not JSON is rejected with its number', () => {
    expect(() => parseFixture('{"dir":"connect"}\nnot json', 'y')).toThrow('y line 2');
  });
});
