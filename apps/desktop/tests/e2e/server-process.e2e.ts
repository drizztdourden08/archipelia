/* @layer tests @kind test */
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { freePort } from '../server/support/free-port';
import { playOpenJoin } from '../server/support/play-open-join';
import { spawnServer } from '../server/support/spawn-server';
import type { SpawnedServer } from '../server/support/spawn-server.type';
import { writeConfig } from '../server/support/write-config';

const NO_NETWORK = process.env.ARCHIPELIA_NO_NETWORK === '1';
const ENGINE_WAIT_MS = 15 * 60 * 1000;

let dataDir = '';
let server: SpawnedServer | undefined;

beforeEach(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'archipelia-process-'));
});

afterEach(async () => {
  await server?.stop();
  server = undefined;
  await rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
});

const config = (port: number, auto: boolean) =>
  `port = ${port}\nnetwork = "off"\nloopback = true\npublicLookup = false\n[engine]\nauto = ${String(auto)}\n[tls]\nselfSigned = false\n`;

const adminToken = async () => (await readFile(join(dataDir, 'Data', 'server', 'admin-token'), 'utf8')).trim();

describe('the built headless server process', () => {
  test('starts on a temp data folder and completes the open-join scenario without an engine', async () => {
    expect(existsSync(join(import.meta.dirname, '..', '..', 'dist', 'server', 'main.mjs'))).toBe(true);
    const port = await freePort();
    await writeConfig(dataDir, config(port, false));
    server = spawnServer(dataDir);
    await server.waitFor(/started$/, 60000);
    const result = await playOpenJoin(port, dataDir, await adminToken());
    expect(result.failure).toBeUndefined();
    expect(result.ok).toBe(true);
  });

  test.skipIf(NO_NETWORK)('installs the default engine on first start, then completes open-join (needs network, skipped when ARCHIPELIA_NO_NETWORK=1)', async () => {
    const port = await freePort();
    await writeConfig(dataDir, config(port, true));
    server = spawnServer(dataDir);
    await server.waitFor(/engine ready: Archipelago \d/, ENGINE_WAIT_MS);
    expect(existsSync(join(dataDir, 'Data', 'engine'))).toBe(true);
    const result = await playOpenJoin(port, dataDir, await adminToken());
    expect(result.failure).toBeUndefined();
    expect(result.ok).toBe(true);
  }, ENGINE_WAIT_MS + 120000);
});
