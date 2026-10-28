/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { readFirstParty } from '../src/first-party/read-first-party';
import {
  BUNDLE_URL, MANIFEST_URL, REGISTRY_URL, STANDARD_URL, WORLD_URL, buildBundleUrl, buildUrl, buildsManifestOf, json, manifestOf, missing, registryOf, routed, standardOf, worldBytes,
} from './first-party.fixtures';
import { memoryFiles } from './memory-files.fixtures';

const read = (routes: Parameters<typeof routed>[0], kind?: 'builds') =>
  readFirstParty({ files: memoryFiles([]), fetch: routed({ [REGISTRY_URL]: () => json(registryOf('active', kind)), ...routes }) });

describe('the standard archipelia.json of a listed world', () => {
  test('a single apworld is read from the world form and its signature defaults to the file name', async () => {
    const bytes = worldBytes();
    const found = await read({ [STANDARD_URL]: () => json(standardOf(bytes, { maximumAp: '0.7.0' })) });
    expect(found.problems).toEqual([]);
    expect(found.entries[0]).toMatchObject({
      apworld: 'relic_of_the_past',
      versions: [{ version: '0.2.0', url: WORLD_URL, sha256: standardOf(bytes).world.sha256, size: bytes.length }],
      firstParty: { client: 'relic-of-the-past', repo: 'drizztdourden08/relic-of-the-past', bundleUrl: BUNDLE_URL, minimumAp: '0.6.4', maximumAp: '0.7.0' },
    });
    expect(found.entries[0]?.unavailable).toBeUndefined();
  });

  test('an appVersion is carried to the entry next to the world version, for a world and for builds', async () => {
    const bytes = worldBytes();
    const single = await read({ [STANDARD_URL]: () => json(standardOf(bytes, { appVersion: '0.21.2' })) });
    expect(single.entries[0]?.versions[0]?.version).toBe('0.2.0');
    expect(single.entries[0]?.firstParty?.appVersion).toBe('0.21.2');
    const manifest = buildsManifestOf([{ ap: '0.6.5', bytes }]);
    const builds = manifest.builds.map((build) => ({ ...build, bundle: undefined }));
    const built = await read({ [STANDARD_URL]: () => json({ ...standardOf(bytes), ...manifest, appVersion: '0.21.2', world: undefined, format: 1, builds }) }, 'builds');
    expect(built.entries[0]?.firstParty).toMatchObject({ worldVersion: manifest.worldVersion, appVersion: '0.21.2' });
  });

  test('a standard manifest without an appVersion leaves it out of the entry', async () => {
    const found = await read({ [STANDARD_URL]: () => json(standardOf(worldBytes())) });
    expect(found.entries[0]?.firstParty).not.toHaveProperty('appVersion');
  });

  test('the world file and its own bundle name decide the download urls', async () => {
    const bytes = worldBytes();
    const world = { ...standardOf(bytes).world, file: 'rotp_v2.apworld', bundle: 'rotp_v2.sig.json' };
    const found = await read({ [STANDARD_URL]: () => json(standardOf(bytes, { world })) });
    expect(found.entries[0]?.versions[0]?.url).toContain('/rotp_v2.apworld');
    expect(found.entries[0]?.firstParty?.bundleUrl).toContain('/rotp_v2.sig.json');
  });

  test('builds are listed with a default signature name and no app version needed', async () => {
    const [a, b] = [worldBytes('ap665'), worldBytes('ap667')];
    const manifest = buildsManifestOf([{ ap: '0.6.5', bytes: a }, { ap: '0.6.7', bytes: b }]);
    const builds = manifest.builds.map((build) => ({ ...build, bundle: undefined }));
    const { appVersion, ...rest } = manifest;
    const found = await read({ [STANDARD_URL]: () => json({ ...standardOf(a), ...rest, world: undefined, format: 1, builds }) }, 'builds');
    expect(appVersion).toBe('0.1.0');
    expect(found.problems).toEqual([]);
    expect(found.entries[0]?.firstParty).toMatchObject({
      minimumAp: '0.6.5',
      maximumAp: '0.6.7',
      builds: [
        { archipelagoVersion: '0.6.5', url: buildUrl('0.6.5'), bundleUrl: buildBundleUrl('0.6.5'), size: a.length },
        { archipelagoVersion: '0.6.7', url: buildUrl('0.6.7'), bundleUrl: buildBundleUrl('0.6.7'), size: b.length },
      ],
    });
  });
});

describe('the standard archipelia.json of a listed world, refused and fallbacks', () => {
  test('it wins over the old manifest name, which is only a fallback', async () => {
    const bytes = worldBytes();
    const found = await read({ [STANDARD_URL]: () => json(standardOf(bytes)), [MANIFEST_URL]: () => json(manifestOf(bytes)) });
    expect(found.entries[0]?.versions[0]?.version).toBe('0.2.0');
  });

  test('without it the old manifest name still works', async () => {
    const found = await read({ [MANIFEST_URL]: () => json(manifestOf(worldBytes())) });
    expect(found.entries[0]?.versions[0]?.version).toBe('0.1.0');
    expect(found.problems).toEqual([]);
  });

  test('an invalid file falls back to a good old manifest, and is reported when there is none', async () => {
    const broken = () => json({ format: 1, game: 'Relic of the Past' });
    const fallback = await read({ [STANDARD_URL]: broken, [MANIFEST_URL]: () => json(manifestOf(worldBytes())) });
    expect(fallback.entries[0]?.versions[0]?.version).toBe('0.1.0');
    const alone = await read({ [STANDARD_URL]: broken, [MANIFEST_URL]: missing });
    expect(alone.entries[0]?.unavailable).toContain('could not be read');
    expect(alone.problems[0]).toContain('archipelia.json');
  });

  test('a file that names another module or game than the registry is refused', async () => {
    const bytes = worldBytes();
    const other = await read({ [STANDARD_URL]: () => json(standardOf(bytes, { module: 'someone_else' })), [MANIFEST_URL]: missing });
    expect(other.entries[0]?.versions).toEqual([]);
    expect(other.problems[0]).toContain('the registry lists');
    const game = await read({ [STANDARD_URL]: () => json(standardOf(bytes, { game: 'Other Game' })), [MANIFEST_URL]: missing });
    expect(game.entries[0]?.unavailable).toContain('could not be read');
  });

  test('a path in a file name, a short hash or both forms at once are refused', async () => {
    const bytes = worldBytes();
    const world = standardOf(bytes).world;
    const bad = [{ world: { ...world, file: '../x.apworld' } }, { world: { ...world, sha256: 'abc' } }, { builds: [], world }];
    for (const patch of bad) {
      const found = await read({ [STANDARD_URL]: () => json(standardOf(bytes, patch)), [MANIFEST_URL]: missing });
      expect(found.entries[0]?.unavailable).toContain('could not be read');
    }
  });

  test('a file over 64 KB is refused', async () => {
    const huge = standardOf(worldBytes(), { note: 'x'.repeat(70 * 1024) });
    const found = await read({ [STANDARD_URL]: () => json(huge), [MANIFEST_URL]: missing });
    expect(found.problems[0]).toContain('larger than');
  });
});
