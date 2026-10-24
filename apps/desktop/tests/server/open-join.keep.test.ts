/* @layer tests @kind test */
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { freePort } from './support/free-port';
import { playOpenJoin } from './support/play-open-join';
import { runStarted } from './support/run-started';
import { writeConfig } from './support/write-config';

let dataDir = '';
let stop: (() => Promise<void>) | undefined;

beforeEach(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'archipelia-server-'));
});

afterEach(async () => {
  await stop?.();
  stop = undefined;
  await rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
});

const config = (port: number) => `port = ${port}\nnetwork = "off"\nloopback = true\npublicLookup = false\n[engine]\nauto = false\n[tls]\nselfSigned = false\n`;

describe('the headless server started from its entry', () => {
  test('completes the open-join scenario of the fake client', async () => {
    const port = await freePort();
    await writeConfig(dataDir, config(port));
    const server = await runStarted(dataDir);
    stop = server.stop;
    const token = (await readFile(join(dataDir, 'Data', 'server', 'admin-token'), 'utf8')).trim();
    const result = await playOpenJoin(port, dataDir, token);
    expect(result.failure).toBeUndefined();
    expect(result.ok).toBe(true);
    expect(server.lines.join('\n')).toContain(`lobby server on ws://127.0.0.1:${port}`);
  }, 60000);
});
