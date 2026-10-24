/* @layer tests @kind test */
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { loadConfig } from '../../server/config/load-config';
import { pickConfig } from '../../server/config/pick-config';
import { dataFolder } from '../../server/data/data-folder';

let dir = '';

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'archipelia-config-'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('the server settings', () => {
  test('default to the lobby port, LAN mode, the lookup on and a self-signed certificate', () => {
    expect(pickConfig({}, {})).toMatchObject({ port: 38290, network: 'lan', publicLookup: true, tls: { selfSigned: true } });
  });

  test('come from the file, and the environment wins over the file', () => {
    const file = { port: 4000, network: 'off', publicLookup: false, engine: { version: '0.6.8' }, tls: { selfSigned: false } };
    const env = { ARCHIPELIA_PORT: '5000', ARCHIPELIA_NETWORK: 'lan-and-internet', ARCHIPELIA_TLS_KEY: '/k.pem', ARCHIPELIA_TLS_CERT: '/c.pem' };
    expect(pickConfig(file, env)).toMatchObject({
      port: 5000,
      network: 'lan-and-internet',
      publicLookup: false,
      engine: { version: '0.6.8' },
      tls: { key: '/k.pem', cert: '/c.pem', selfSigned: false },
    });
  });

  test('read true and false words from the environment', () => {
    const env = { ARCHIPELIA_PUBLIC_LOOKUP: 'off', ARCHIPELIA_LOOPBACK: 'Yes', ARCHIPELIA_ENGINE_AUTO: '0' };
    expect(pickConfig({}, env)).toMatchObject({ publicLookup: false, loopback: true, engine: { auto: false } });
  });

  test('refuse a bad port, mode or flag and name the key', () => {
    expect(() => pickConfig({ port: 70000 }, {})).toThrow('port: 70000 is not a port');
    expect(() => pickConfig({}, { ARCHIPELIA_NETWORK: 'wide' })).toThrow('network (environment): wide is not one of');
    expect(() => pickConfig({ loopback: 'maybe' }, {})).toThrow('loopback: maybe is not true or false');
  });

  test('load from server.toml in the data folder, or from the named file', async () => {
    await writeFile(join(dir, 'server.toml'), 'port = 41000\n[tls]\nselfSigned = false\n');
    expect(loadConfig(dir, [], {})).toMatchObject({ file: join(dir, 'server.toml'), config: { port: 41000, tls: { selfSigned: false } } });
    const named = join(dir, 'other.toml');
    await writeFile(named, 'port = 42000\n');
    expect(loadConfig(dir, [`--config=${named}`], {}).config.port).toBe(42000);
    expect(loadConfig(dir, [], { ARCHIPELIA_CONFIG: named }).config.port).toBe(42000);
  });

  test('stop with the file name when the file is not valid TOML', async () => {
    await writeFile(join(dir, 'server.toml'), 'port = = 1');
    expect(() => loadConfig(dir, [], {})).toThrow(join(dir, 'server.toml'));
  });
});

describe('the data folder', () => {
  test('is the flag, then BROCK_DATA_DIR, then STATE_DIRECTORY, then .user-data', () => {
    const cwd = join(dir, 'work');
    expect(dataFolder([`--user-data=${join(dir, 'flag')}`], { BROCK_DATA_DIR: join(dir, 'env') }, cwd)).toBe(join(dir, 'flag'));
    expect(dataFolder([], { BROCK_DATA_DIR: join(dir, 'env') }, cwd)).toBe(join(dir, 'env'));
    expect(dataFolder([], { STATE_DIRECTORY: join(dir, 'state') }, cwd)).toBe(join(dir, 'state'));
    expect(dataFolder([], {}, cwd)).toBe(resolve(cwd, '.user-data'));
  });
});
