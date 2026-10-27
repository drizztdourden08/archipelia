/* @layer tests @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  buildApworldIndex,
  buildReleaseManifest,
  checkReleaseManifest,
  indexOfRelease,
  KIT_VERSION,
  parseReleaseManifest,
  serializeApworldIndex,
  serializeReleaseManifest,
} from '../src';
import type { ReleaseInput } from '../src';
import { ROTP_GAME, ROTP_MODULE } from './helpers/rotp-world.constants';

const HASH_A = 'a'.repeat(64);
const HASH_B = 'b'.repeat(64);

const buildOf = (archipelagoVersion: string, sha256: string): { archipelagoVersion: string; sha256: string; size: number } => ({ archipelagoVersion, sha256, size: 1 });

const input: ReleaseInput = {
  game: ROTP_GAME,
  module: ROTP_MODULE,
  worldVersion: '0.1.0',
  appVersion: '0.22.0',
  minimumAp: '0.6.4',
  maximumAp: '0.6.8',
  direct: true,
  builds: [
    { archipelagoVersion: '0.6.8', sha256: HASH_B, size: 200 },
    { archipelagoVersion: '0.6.7', sha256: HASH_A, size: 100 },
  ],
};

const worldInput: ReleaseInput = {
  game: ROTP_GAME,
  module: ROTP_MODULE,
  worldVersion: '0.1.0',
  minimumAp: '0.6.4',
  direct: false,
  world: { file: 'relic_of_the_past.apworld', sha256: HASH_A, size: 100 },
};

describe('the release manifest', () => {
  test('has the agreed shape, in the agreed order, with builds oldest first', () => {
    const manifest = buildReleaseManifest(input);
    expect(Object.keys(manifest)).toEqual(['format', 'game', 'module', 'worldVersion', 'minimumAp', 'maximumAp', 'direct', 'kit', 'appVersion', 'builds']);
    expect(manifest).toMatchObject({ format: 1, direct: true, kit: KIT_VERSION, appVersion: '0.22.0' });
    expect(manifest.builds?.map((build) => build.archipelagoVersion)).toEqual(['0.6.7', '0.6.8']);
    expect(manifest.builds?.[0]).toEqual({
      archipelagoVersion: '0.6.7',
      file: 'relic_of_the_past-ap0.6.7.apworld',
      sha256: HASH_A,
      size: 100,
      bundle: 'relic_of_the_past-ap0.6.7.apworld.sigstore.json',
    });
  });

  test('the kit version in the manifest is the version of this package', () => {
    const { version } = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8')) as { version: string };
    expect(KIT_VERSION).toBe(version);
  });

});

describe('the release manifest forms', () => {
  test('appVersion and maximumAp are left out when not given, and a world replaces builds', () => {
    const manifest = buildReleaseManifest(worldInput);
    expect(Object.keys(manifest)).toEqual(['format', 'game', 'module', 'worldVersion', 'minimumAp', 'direct', 'kit', 'world']);
    expect(manifest.builds).toBeUndefined();
    expect(indexOfRelease(manifest)).toBeUndefined();
  });

  test('text round trips and ends with a newline', () => {
    for (const source of [input, worldInput]) {
      const manifest = buildReleaseManifest(source);
      const text = serializeReleaseManifest(manifest);
      expect(text.endsWith('}\n')).toBe(true);
      expect(parseReleaseManifest(text)).toEqual(manifest);
    }
  });

  test('keeps the old index readable: the release builds are the index builds', () => {
    const manifest = buildReleaseManifest(input);
    const { builds, ...rest } = input;
    const old = buildApworldIndex({ ...rest, appVersion: '0.22.0', builds: builds ?? [] });
    expect(indexOfRelease(manifest)).toEqual(old);
    expect(JSON.parse(serializeApworldIndex(old))).not.toHaveProperty('format');
  });

  test.each([
    [{ builds: [] }, 'at least one build'],
    [{ builds: [buildOf('0.6.8', HASH_A), buildOf('0.6.8', HASH_B)] }, 'same Archipelago version'],
    [{ builds: [buildOf('0.6.8', 'XYZ')] }, 'sha256'],
    [{ builds: [buildOf('0.6.9', HASH_A)] }, 'supports Archipelago 0.6.4 to 0.6.8'],
    [{ builds: undefined }, 'give builds or world'],
    [{ world: { file: 'a.apworld', sha256: HASH_A, size: 1 } }, 'not both'],
    [{ module: 'not ok' }, 'module'],
    [{ appVersion: ' ' }, 'appVersion'],
    [{ kit: 'latest' }, 'kit'],
    [{ minimumAp: 'x' }, 'minimumAp'],
    [{ maximumAp: '0.6.3' }, 'older than minimumAp'],
  ])('refuses %j', (patch, part) => {
    expect(() => buildReleaseManifest({ ...input, ...patch })).toThrow(part);
    expect(checkReleaseManifest({ ...input, ...patch }).map((issue) => issue.message).join('\n')).toContain(part);
  });

  test.each([
    [{ file: '../a.apworld', sha256: HASH_A, size: 1 }, 'plain file name'],
    [{ file: 'a.zip', sha256: HASH_A, size: 1 }, 'ending in .apworld'],
    [{ file: 'a.apworld', sha256: HASH_A, size: 0 }, 'size'],
    [{ file: 'a.apworld', sha256: HASH_A, size: 1, bundle: 'other.json' }, 'a.apworld.sigstore.json'],
  ])('refuses the world %j', (world, part) => {
    expect(() => buildReleaseManifest({ ...worldInput, world })).toThrow(part);
  });

  test('a clean input has no issues', () => {
    expect(checkReleaseManifest(input)).toEqual([]);
    expect(checkReleaseManifest(worldInput)).toEqual([]);
  });
});

describe('parsing a release manifest', () => {
  const text = serializeReleaseManifest(buildReleaseManifest(input));
  const patched = (change: (record: Record<string, unknown>) => void): string => {
    const record = JSON.parse(text) as Record<string, unknown>;
    change(record);
    return JSON.stringify(record);
  };

  test.each([
    ['[', 'not JSON'],
    ['[]', 'top level'],
    [patched((record) => { record.format = 2; }), 'format must be 1'],
    [patched((record) => { delete record.format; }), 'format must be 1'],
    [patched((record) => { record.direct = 'yes'; }), 'direct must be true or false'],
    [patched((record) => { delete record.kit; }), 'kit must be a text'],
    [patched((record) => { delete record.game; }), 'game must be a text'],
    [patched((record) => { record.builds = 'none'; }), 'builds must be a list'],
    [patched((record) => { record.world = 3; }), 'world must be an object'],
    [patched((record) => { delete record.builds; }), 'builds must be a list'],
    [text.replace('relic_of_the_past-ap0.6.8.apworld"', 'other.apworld"'), 'naming rule'],
    [`${text.slice(0, -2)}, "pad": "${'x'.repeat(70000)}"}`, 'larger than 65536 bytes'],
  ])('refuses %#', (source, part) => {
    expect(() => parseReleaseManifest(source)).toThrow(part);
  });

  test('reads a manifest without maximumAp or appVersion', () => {
    const source = patched((record) => { delete record.maximumAp; delete record.appVersion; });
    const manifest = parseReleaseManifest(source);
    expect(manifest.maximumAp).toBeUndefined();
    expect(manifest.appVersion).toBeUndefined();
  });
});
