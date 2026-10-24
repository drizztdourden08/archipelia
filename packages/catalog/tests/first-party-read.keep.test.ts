/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { readFirstParty } from '../src/first-party/read-first-party';
import { BUNDLE_URL, MANIFEST_URL, REGISTRY_URL, WORLD_URL, buildBundleUrl, buildUrl, buildsManifestOf, json, manifestOf, missing, registryOf, routed, worldBytes } from './first-party.fixtures';
import { memoryFiles } from './memory-files.fixtures';

const HOUR = 3_600_000;

describe('readFirstParty', () => {
  test('turns the registry game and its release manifest into a first-party entry', async () => {
    const bytes = worldBytes();
    const fetchFn = routed({ [REGISTRY_URL]: () => json(registryOf()), [MANIFEST_URL]: () => json(manifestOf(bytes, { maximumAp: '0.7.0' })) });
    const read = await readFirstParty({ files: memoryFiles([]), fetch: fetchFn });
    expect(read.source).toBe('network');
    expect(read.entries).toHaveLength(1);
    expect(read.entries[0]).toMatchObject({
      apworld: 'relic_of_the_past',
      game: 'Relic of the Past',
      source: 'first-party',
      versions: [{ version: '0.1.0', url: WORLD_URL, sha256: manifestOf(bytes).sha256 }],
      firstParty: { client: 'relic-of-the-past', bundleUrl: BUNDLE_URL, minimumAp: '0.6.4', maximumAp: '0.7.0' },
    });
    expect(read.entries[0]?.unavailable).toBeUndefined();
    expect(read.clients.map((client) => client.id)).toEqual(['relic-of-the-past']);
  });

});

describe('readFirstParty manifests and fallbacks', () => {
  test('lists every build and leaves the version to the engine', async () => {
    const [a, b] = [worldBytes('ap665'), worldBytes('ap667')];
    const manifest = buildsManifestOf([{ ap: '0.6.5', bytes: a }, { ap: '0.6.7', bytes: b }]);
    const fetchFn = routed({ [REGISTRY_URL]: () => json(registryOf('active', 'builds')), [MANIFEST_URL]: () => json(manifest) });
    const read = await readFirstParty({ files: memoryFiles([]), fetch: fetchFn });
    expect(read.problems).toEqual([]);
    expect(read.entries[0]).toMatchObject({ source: 'first-party', versions: [] });
    expect(read.entries[0]?.unavailable).toBeUndefined();
    expect(read.entries[0]?.firstParty).toMatchObject({
      worldVersion: '0.1.0',
      minimumAp: '0.6.5',
      maximumAp: '0.6.7',
      builds: [
        { archipelagoVersion: '0.6.5', url: buildUrl('0.6.5'), bundleUrl: buildBundleUrl('0.6.5'), sha256: manifest.builds[0]?.sha256, size: a.length },
        { archipelagoVersion: '0.6.7', url: buildUrl('0.6.7'), bundleUrl: buildBundleUrl('0.6.7'), size: b.length },
      ],
    });
  });

  test('a single manifest in a builds index is reported', async () => {
    const fetchFn = routed({ [REGISTRY_URL]: () => json(registryOf('active', 'builds')), [MANIFEST_URL]: () => json(manifestOf(worldBytes())) });
    const read = await readFirstParty({ files: memoryFiles([]), fetch: fetchFn });
    expect(read.entries[0]?.unavailable).toContain('could not be read');
  });

  test('a release with no manifest yet is listed as No release yet, not as a problem', async () => {
    const fetchFn = routed({ [REGISTRY_URL]: () => json(registryOf()), [MANIFEST_URL]: missing });
    const read = await readFirstParty({ files: memoryFiles([]), fetch: fetchFn });
    expect(read.entries[0]).toMatchObject({ source: 'first-party', versions: [], unavailable: 'No release yet' });
    expect(read.problems).toEqual([]);
  });

  test('a manifest that cannot be read is reported and the entry says so', async () => {
    const fetchFn = routed({ [REGISTRY_URL]: () => json(registryOf()), [MANIFEST_URL]: () => json({ game: 'x' }) });
    const read = await readFirstParty({ files: memoryFiles([]), fetch: fetchFn });
    expect(read.entries[0]?.unavailable).toContain('could not be read');
    expect(read.problems).toHaveLength(1);
  });

  test('offline, it keeps listing the game from the cached registry', async () => {
    const files = memoryFiles([]);
    const online = routed({ [REGISTRY_URL]: () => json(registryOf()), [MANIFEST_URL]: () => json(manifestOf(worldBytes())) });
    await readFirstParty({ files, fetch: online, now: () => 1000 });
    const read = await readFirstParty({ files, fetch: routed({}), now: () => 1000 + 7 * HOUR });
    expect(read.source).toBe('cache');
    expect(read.entries.map((entry) => entry.apworld)).toEqual(['relic_of_the_past']);
    expect(read.entries[0]?.unavailable).toContain('could not be read');
    expect(read.problems.length).toBeGreaterThan(0);
  });

  test('with no cache and no network it falls back to the bundled floor', async () => {
    const read = await readFirstParty({ files: memoryFiles([]), fetch: routed({}) });
    expect(read.source).toBe('floor');
    expect(read.entries.map((entry) => entry.apworld)).toContain('relic_of_the_past');
  });
});
