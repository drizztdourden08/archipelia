/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { parseCommand } from '../../server/cli/parse-command';
import { runCli } from '../../server/cli/run-cli';
import { freePort } from './support/free-port';
import { runStarted } from './support/run-started';
import { writeConfig } from './support/write-config';

let dir = '';

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'archipelia-cli-'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
});

const run = async (words: string[]) => {
  const out: string[] = [];
  const err: string[] = [];
  const code = await runCli(parseCommand(words), { dataDir: dir, args: words, env: {}, out: (line) => out.push(line), err: (line) => err.push(line) });
  return { code, out, err };
};

describe('parsing the command line', () => {
  test('defaults to start and keeps words and flags apart', () => {
    expect(parseCommand([])).toEqual({ name: 'start', words: [], flags: {} });
    expect(parseCommand(['--user-data=/d', '--no-focus'])).toMatchObject({ name: 'start', flags: { 'user-data': '/d', 'no-focus': '' } });
    expect(parseCommand(['engine', 'install', '0.6.8', '--python', '3.12.14'])).toEqual({
      name: 'engine', words: ['install', '0.6.8'], flags: { python: '3.12.14' },
    });
  });

  test('does not take the next word as the value of a flag that has none', () => {
    expect(parseCommand(['--muted', 'status'])).toEqual({ name: 'status', words: [], flags: { muted: '' } });
  });
});

describe('the archipelia-server commands', () => {
  test('help shows the usage and unknown commands exit with 2', async () => {
    expect((await run(['help'])).out.join('\n')).toContain('archipelia-server');
    const unknown = await run(['frobnicate']);
    expect(unknown.code).toBe(2);
    expect(unknown.err[0]).toContain('Unknown command "frobnicate"');
  });

  test('token prints the path and exits 1 until the server has made the file', async () => {
    const before = await run(['token']);
    expect(before.out[0]).toBe(join(dir, 'Data', 'server', 'admin-token'));
    expect(before.code).toBe(1);
    const port = await freePort();
    await writeConfig(dir, `port = ${port}\nnetwork = "off"\nloopback = true\npublicLookup = false\n[engine]\nauto = false\n[tls]\nselfSigned = false\n`);
    const server = await runStarted(dir);
    try {
      const after = await run(['token']);
      expect(after.code).toBe(0);
      expect(after.out[0]).toBe(before.out[0]);
    } finally {
      await server.stop();
    }
  }, 60000);

  test('status reports the folder, the settings, the TLS state and a missing engine', async () => {
    const status = await run(['status']);
    const text = status.out.join('\n');
    expect(text).toContain(`data folder: ${dir}`);
    expect(text).toContain('lobby port: 38290, network: lan');
    expect(text).toContain('health: unhealthy');
    expect(text).toContain('TLS: a self-signed certificate is made on the first start');
    expect(text).toContain('engine: missing');
    expect(status.code).toBe(1);
  }, 60000);

  test('engine install asks for a version and engine switch for an id', async () => {
    expect((await run(['engine', 'install'])).code).toBe(2);
    expect((await run(['engine', 'switch'])).code).toBe(2);
    expect((await run(['engine', 'nonsense'])).code).toBe(2);
  }, 60000);
});
