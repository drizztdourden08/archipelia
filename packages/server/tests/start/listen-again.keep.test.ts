/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import type { CoreDomains } from '../../src';
import { startCore } from '../../src';
import { createNodeDomains, createNodeRest } from '../../src/node';

let dataDir = '';

beforeEach(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'archipelia-listen-'));
});

afterEach(async () => {
  await rm(dataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
});

const started = () => {
  const host: ServerHost<CoreDomains> = { dataDir, args: [], log: () => undefined, domains: createNodeDomains(dataDir) };
  return startCore(host, createNodeRest(host, { automation: true }));
};

describe('the listener of the core', () => {
  test('hands out the running listener, and opens a new one once it was stopped', async () => {
    const server = started();
    const first = await server.listen({ port: 0, mode: 'off' });
    expect(await server.listen({ port: 0, mode: 'lan' })).toBe(first);
    await first.stop();
    const second = await server.listen({ port: 0, mode: 'lan' });
    expect(second).not.toBe(first);
    expect(second.reach().mode).toBe('lan');
    await server.stop();
  });

  test('forgets a listener that could not open, so the next try can succeed', async () => {
    const busy = createServer();
    await new Promise<void>((resolve) => busy.listen(0, '127.0.0.1', resolve));
    const { port } = busy.address() as { port: number };
    const server = started();
    await expect(server.listen({ port, mode: 'off' })).rejects.toThrow();
    await new Promise((resolve) => busy.close(resolve));
    const again = await server.listen({ port: 0, mode: 'off' });
    expect(again.port).toBeGreaterThan(0);
    await server.stop();
  });
});
