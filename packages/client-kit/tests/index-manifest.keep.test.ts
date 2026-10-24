/* @layer tests @kind test */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { apworldNames, buildApworldIndex, newestBuild, parseApworldIndex, readApworld, serializeApworldIndex } from '../src';
import type { IndexInput } from '../src';
import { buildApworldSet, sha256Hex } from '../src/node';
import { ROTP_DATA, ROTP_GAME, ROTP_MODULE, ROTP_WORLD_FILES } from './helpers/rotp-world.constants';
import { cleanTempDirs, makeTempDir } from './helpers/temp-dirs';
import { writeFiles } from './helpers/write-files';

afterEach(cleanTempDirs);

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);

const indexInput: IndexInput = {
  game: ROTP_GAME,
  module: ROTP_MODULE,
  worldVersion: '0.1.0',
  appVersion: '0.22.0',
  minimumAp: '0.6.4',
  builds: [
    { archipelagoVersion: '0.6.8', sha256: HASH_B, size: 200 },
    { archipelagoVersion: '0.6.7', sha256: HASH_A, size: 100 },
  ],
};

describe('the index manifest', () => {
  test('names files and bundles by the agreed rule', () => {
    expect(apworldNames(ROTP_MODULE, '0.6.8')).toEqual({
      file: 'relic_of_the_past-ap0.6.8.apworld',
      bundle: 'relic_of_the_past-ap0.6.8.apworld.sigstore.json',
      latest: 'relic_of_the_past.apworld',
      latestBundle: 'relic_of_the_past.apworld.sigstore.json',
      index: 'relic_of_the_past.apworld.json',
    });
  });

  test('has the agreed shape with builds sorted oldest first', () => {
    const index = buildApworldIndex(indexInput);
    expect(index).toEqual({
      game: 'Relic of the Past',
      module: 'relic_of_the_past',
      worldVersion: '0.1.0',
      appVersion: '0.22.0',
      minimumAp: '0.6.4',
      builds: [
        { archipelagoVersion: '0.6.7', file: 'relic_of_the_past-ap0.6.7.apworld', sha256: HASH_A, size: 100, bundle: 'relic_of_the_past-ap0.6.7.apworld.sigstore.json' },
        { archipelagoVersion: '0.6.8', file: 'relic_of_the_past-ap0.6.8.apworld', sha256: HASH_B, size: 200, bundle: 'relic_of_the_past-ap0.6.8.apworld.sigstore.json' },
      ],
    });
    expect(Object.keys(index)).toEqual(['game', 'module', 'worldVersion', 'appVersion', 'minimumAp', 'builds']);
    expect(newestBuild(index)?.archipelagoVersion).toBe('0.6.8');
  });

  test('maximumAp is written when given, and the text round trips', () => {
    const index = buildApworldIndex({ ...indexInput, maximumAp: '0.6.9' });
    expect(Object.keys(index)).toContain('maximumAp');
    expect(parseApworldIndex(serializeApworldIndex(index))).toEqual(index);
    expect(serializeApworldIndex(index).endsWith('}\n')).toBe(true);
  });

  test.each([
    [{ builds: [] }, 'at least one build'],
    [{ builds: [{ archipelagoVersion: '0.6.8', sha256: HASH_A, size: 1 }, { archipelagoVersion: '0.6.8', sha256: HASH_B, size: 1 }] }, 'same Archipelago version'],
    [{ builds: [{ archipelagoVersion: '0.6.8', sha256: 'XYZ', size: 1 }] }, 'sha256'],
    [{ builds: [{ archipelagoVersion: '0.6.8', sha256: HASH_A, size: 0 }] }, 'size'],
    [{ builds: [{ archipelagoVersion: 'nope', sha256: HASH_A, size: 1 }] }, 'not an Archipelago version'],
    [{ builds: [{ archipelagoVersion: '0.6.3', sha256: HASH_A, size: 1 }] }, 'supports Archipelago 0.6.4 and newer'],
    [{ module: 'not ok' }, 'module'],
    [{ appVersion: '' }, 'appVersion'],
  ])('refuses %j', (patch, part) => {
    expect(() => buildApworldIndex({ ...indexInput, ...patch })).toThrow(part);
  });

  test('parsing refuses a broken file and a name that breaks the rule', () => {
    expect(() => parseApworldIndex('[')).toThrow('not JSON');
    expect(() => parseApworldIndex('{"builds": []}')).toThrow('game must be a text');
    const index = serializeApworldIndex(buildApworldIndex(indexInput)).replace('relic_of_the_past-ap0.6.8.apworld"', 'other.apworld"');
    expect(() => parseApworldIndex(index)).toThrow('naming rule');
  });
});

describe('per-version builds', () => {
  const setOptions = async (): Promise<Parameters<typeof buildApworldSet>[0]> => {
    const root = await makeTempDir();
    await writeFiles(join(root, ROTP_MODULE), ROTP_WORLD_FILES);
    return {
      game: ROTP_GAME,
      worldVersion: '0.1.0',
      appVersion: '0.22.0',
      minimumAp: '0.6.4',
      worldDir: join(root, ROTP_MODULE),
      outDir: join(root, 'out'),
      data: ROTP_DATA as never,
      builds: [{ archipelagoVersion: '0.6.8' }, { archipelagoVersion: '0.6.7' }],
    };
  };

  test('writes one apworld per version, the newest copy and the index', async () => {
    const options = await setOptions();
    const result = await buildApworldSet(options);
    expect(result.files.map((file) => file.file)).toEqual(['relic_of_the_past-ap0.6.8.apworld', 'relic_of_the_past-ap0.6.7.apworld']);
    const latest = new Uint8Array(await readFile(join(options.outDir, 'relic_of_the_past.apworld')));
    const newest = new Uint8Array(await readFile(join(options.outDir, 'relic_of_the_past-ap0.6.8.apworld')));
    expect(sha256Hex(latest)).toBe(sha256Hex(newest));
    const indexText = await readFile(join(options.outDir, 'relic_of_the_past.apworld.json'), 'utf8');
    const index = parseApworldIndex(indexText);
    expect(indexText).toBe(serializeApworldIndex(result.index));
    expect(index.builds.map((build) => build.archipelagoVersion)).toEqual(['0.6.7', '0.6.8']);
    for (const build of index.builds) {
      const bytes = new Uint8Array(await readFile(join(options.outDir, build.file)));
      expect(sha256Hex(bytes)).toBe(build.sha256);
      expect(bytes.length).toBe(build.size);
      expect(readApworld(bytes).manifest.minimumAp).toBe('0.6.4');
    }
  });

  test('a second run gives the same index and the same files', async () => {
    const options = await setOptions();
    const first = await buildApworldSet(options);
    const second = await buildApworldSet(options);
    expect(second.index).toEqual(first.index);
  });

  test('a per-build range narrows that build and a version outside the range is refused', async () => {
    const options = await setOptions();
    const result = await buildApworldSet({ ...options, builds: [{ archipelagoVersion: '0.6.7', maximumAp: '0.6.7' }, { archipelagoVersion: '0.6.8' }] });
    const old = new Uint8Array(await readFile(join(options.outDir, 'relic_of_the_past-ap0.6.7.apworld')));
    expect(readApworld(old).manifest.maximumAp).toBe('0.6.7');
    expect(result.index.builds).toHaveLength(2);
    await expect(buildApworldSet({ ...options, builds: [{ archipelagoVersion: '0.6.3' }] })).rejects.toThrow('Build for Archipelago 0.6.3');
  });
});
