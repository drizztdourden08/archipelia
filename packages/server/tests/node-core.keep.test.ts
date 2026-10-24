/* @layer tests @kind test */
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import type { ServerHost } from '@drizztdourden08/brock-electron/server';
import type { CoreDomains, CoreEvent } from '../src';
import { startCore } from '../src';
import { createNodeDomains, createNodeRest, nodeLanHost } from '../src/node';

let dataDir = '';

beforeEach(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'archipelia-node-core-'));
});

afterEach(async () => {
  await rm(dataDir, { recursive: true, force: true });
});

const hostOf = (log: string[]): ServerHost<CoreDomains> => ({
  dataDir, args: [], log: (message) => { log.push(message); }, domains: createNodeDomains(dataDir),
});

describe('the core under plain Node', () => {
  test('starts on a temp data folder with Node storage, secrets and jobs', async () => {
    const log: string[] = [];
    const events: CoreEvent[] = [];
    const host = hostOf(log);
    const { core, stop } = startCore(host, createNodeRest(host, { onEvent: (event) => events.push(event) }));
    expect(await core.installed()).toEqual([]);
    expect((await core.engine.status()).dir).toBe(join(dataDir, 'Data', 'engine'));
    const preset = await core.presets.create({ game: 'ChecksFinder', name: 'First', values: {} });
    expect((await core.presets.list()).map((entry) => entry.id)).toEqual([preset.id]);
    expect(await readFile(join(dataDir, 'Data', 'presets', `${preset.id}.json`), 'utf8')).toContain('First');
    await expect(Promise.resolve(stop())).resolves.toBeUndefined();
    expect(log).toEqual([]);
  });

  test('keeps the secrets in a file of the data folder', async () => {
    const host = hostOf([]);
    const rest = createNodeRest(host);
    await rest.secrets.set('room-owner', 'abc');
    expect(await rest.secrets.get('room-owner')).toBe('abc');
    expect(await readFile(join(dataDir, 'secrets', 'secrets.json'), 'utf8')).toContain('room-owner');
  });

  test('an environment variable overrides a stored secret', async () => {
    const host = hostOf([]);
    const rest = createNodeRest(host, { env: { BROCK_SECRET_ROOM_OWNER: 'from-env' } });
    await rest.secrets.set('room-owner', 'abc');
    expect(await rest.secrets.get('room-owner')).toBe('from-env');
  });

  test('refuses to start without the data domains', () => {
    const host: ServerHost<CoreDomains> = { dataDir, args: [], log: () => undefined };
    expect(() => startCore(host, createNodeRest(host))).toThrow('the core needs the data domains of its host');
  });

  test('picks an address for the lobby', () => {
    expect(nodeLanHost()).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
  });
});
