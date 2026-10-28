/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { EngineRuntime, InstalledGame } from '@archipelia/model';
import { BUNDLE_URL, MANIFEST_URL, REGISTRY_URL, buildBundleUrl, buildUrl, buildsManifestOf, bytesResponse, json, missing, registryOf, routed, sha256Of, worldBytes } from './first-party.fixtures';
import { memoryFiles, recordOf } from './memory-files.fixtures';
import { downloadUrl, releasesBody, releasesUrl } from './versions.fixtures';

const engineAp = vi.hoisted(() => ({ value: '0.6.7' }));
const placed = vi.hoisted(() => vi.fn((job: unknown) => Promise.resolve(job)));

vi.mock('@archipelia/engine', async (original) => ({
  ...(await original<object>()),
  readRuntime: () => Promise.resolve({ apVersion: engineAp.value }),
}));
vi.mock('../src/install/commit-install', () => ({ commitInstall: placed }));

const { carryWorlds } = await import('../src/install/carry-worlds');
const { reinstallFirstParty } = await import('../src/install/reinstall-first-party');

const at665 = worldBytes('ap 0.6.5');
const at667 = worldBytes('ap 0.6.7');

const manifest = buildsManifestOf([{ ap: '0.6.5', bytes: at665 }, { ap: '0.6.7', bytes: at667 }]);

const fetchFn = () => routed({
  [REGISTRY_URL]: () => json(registryOf('active', 'builds')),
  [MANIFEST_URL]: () => json(manifest),
  [buildUrl('0.6.5')]: () => bytesResponse(at665),
  [buildUrl('0.6.7')]: () => bytesResponse(at667),
  [buildBundleUrl('0.6.5')]: missing,
  [buildBundleUrl('0.6.7')]: missing,
  [BUNDLE_URL]: missing,
});

const reinstall = (engineDir: string) => reinstallFirstParty({
  engineDir, files: memoryFiles([]), cache: memoryFiles([]), apworld: 'relic_of_the_past', fetch: fetchFn(), trustRoot: () => Promise.resolve({} as never),
});

const runtime = (id: string): EngineRuntime => ({
  id, apVersion: '', apCommit: '', pythonVersion: '', root: id, python: '', generate: '', multiServer: '', schemaScript: '',
});

const firstPartyRecord = (): InstalledGame =>
  recordOf('relic_of_the_past', { source: 'first-party', version: '0.1.0', path: 'custom_worlds/relic_of_the_past.apworld' });

beforeEach(() => {
  engineAp.value = '0.6.7';
  placed.mockClear();
});

describe('an engine switch with an installed first-party world', () => {
  test('reinstalls the build for the version of the new engine', async () => {
    engineAp.value = '0.6.5';
    await reinstall('new-engine');
    const job = placed.mock.calls[0]?.[0] as { source: string; hash: { sha256: string } };
    expect(job.source).toBe('first-party');
    expect(job.hash.sha256).toBe(manifest.builds[0]?.sha256);
  });

  test('picks the other build for the other engine', async () => {
    await reinstall('new-engine');
    const job = placed.mock.calls[0]?.[0] as { hash: { sha256: string } };
    expect(job.hash.sha256).toBe(manifest.builds[1]?.sha256);
  });

  test('reports the game unavailable when the new engine has no build', async () => {
    engineAp.value = '0.6.9';
    await expect(reinstall('new-engine')).rejects.toThrow('No Relic of the Past build for Archipelago 0.6.9; builds exist for 0.6.5, 0.6.7');
    expect(placed).not.toHaveBeenCalled();
  });

  test('carryWorlds reinstalls it from the registry instead of copying the old file', async () => {
    const files = memoryFiles([firstPartyRecord()]);
    const reinstalled: string[] = [];
    const result = await carryWorlds({
      from: runtime('old'), to: runtime('new'), files, reinstall: () => Promise.resolve(),
      reinstallFirstParty: (apworld) => { reinstalled.push(apworld); return Promise.resolve(); },
    });
    expect(result).toMatchObject({ reinstalled: ['relic_of_the_past'], copied: [], problems: [] });
    expect(reinstalled).toEqual(['relic_of_the_past']);
  });

  test('carryWorlds lists a world with no build for the new engine as a problem', async () => {
    engineAp.value = '0.6.9';
    const result = await carryWorlds({
      from: runtime('old'), to: runtime('new'), files: memoryFiles([firstPartyRecord()]), reinstall: () => Promise.resolve(),
      reinstallFirstParty: () => reinstall('new-engine'),
    });
    expect(result.reinstalled).toEqual([]);
    expect(result.problems).toHaveLength(1);
    expect(result.problems[0]?.reason).toContain('No Relic of the Past build for Archipelago 0.6.9');
  });
});

describe('an engine switch with a world installed from a chosen release', () => {
  const REPO = 'drizztdourden08/relic-of-the-past';
  const MANIFEST = 'relic_of_the_past.apworld.json';
  const old65 = worldBytes('old 0.6.5');
  const old67 = worldBytes('old 0.6.7');
  const new67 = worldBytes('new 0.6.7');
  const oldAssets = [MANIFEST, 'relic_of_the_past-ap0.6.5.apworld', 'relic_of_the_past-ap0.6.7.apworld'];

  const tagRoutes = (tag: string, builds: { ap: string; bytes: Uint8Array }[], worldVersion: string) => ({
    [downloadUrl(REPO, tag, 'archipelia.json')]: missing,
    [downloadUrl(REPO, tag, MANIFEST)]: () => json(buildsManifestOf(builds, { worldVersion })),
    ...Object.fromEntries(builds.flatMap(({ ap, bytes }) => [
      [downloadUrl(REPO, tag, `relic_of_the_past-ap${ap}.apworld`), () => bytesResponse(bytes)],
      [downloadUrl(REPO, tag, `relic_of_the_past-ap${ap}.apworld.sigstore.json`), missing],
    ])),
  });

  const reinstallFrom = (release: InstalledGame['release'], releases: Parameters<typeof releasesBody>[0], oldBuilds = [{ ap: '0.6.5', bytes: old65 }, { ap: '0.6.7', bytes: old67 }]) => reinstallFirstParty({
    engineDir: 'new-engine', cache: memoryFiles([]), apworld: 'relic_of_the_past', trustRoot: () => Promise.resolve({} as never),
    files: memoryFiles([{ ...firstPartyRecord(), ...(release ? { release } : {}) }]),
    fetch: routed({
      [REGISTRY_URL]: () => json(registryOf('active', 'builds')),
      [MANIFEST_URL]: () => json(buildsManifestOf([{ ap: '0.6.7', bytes: new67 }], { worldVersion: '0.2.0' })),
      [buildUrl('0.6.7')]: () => bytesResponse(new67),
      [buildBundleUrl('0.6.7')]: missing,
      [releasesUrl(REPO)]: () => json(releasesBody(releases)),
      ...tagRoutes('v0.1.0', oldBuilds, '0.1.0'),
      ...tagRoutes('v0.2.0', [{ ap: '0.6.7', bytes: new67 }], '0.2.0'),
    }),
  });

  const job = () => placed.mock.calls[0]?.[0] as { version: string; release?: { tag: string }; hash: { sha256: string } };

  test('keeps the release the person had when it fits the new engine', async () => {
    const done = await reinstallFrom({ tag: 'v0.1.0', prerelease: false }, [
      { tag: 'v0.2.0', assets: [MANIFEST, 'relic_of_the_past-ap0.6.7.apworld'] }, { tag: 'v0.1.0', assets: oldAssets },
    ]);
    expect(job()).toMatchObject({ version: '0.1.0', release: { tag: 'v0.1.0', prerelease: false } });
    expect(job().hash.sha256).toBe(sha256Of(old67));
    expect(done.note).toBeUndefined();
  });

  test('falls back to the newest compatible stable release and says so when it does not fit', async () => {
    const result = await carryWorlds({
      from: runtime('old'), to: runtime('new'), files: memoryFiles([{ ...firstPartyRecord(), release: { tag: 'v0.1.0', prerelease: false } }]), reinstall: () => Promise.resolve(),
      reinstallFirstParty: () => reinstallFrom({ tag: 'v0.1.0', prerelease: false }, [
        { tag: 'v0.2.0', assets: [MANIFEST, 'relic_of_the_past-ap0.6.7.apworld'] }, { tag: 'v0.1.0', assets: [MANIFEST, 'relic_of_the_past-ap0.6.5.apworld'] },
      ], [{ ap: '0.6.5', bytes: old65 }]),
    });
    expect(job()).toMatchObject({ version: '0.2.0', release: { tag: 'v0.2.0' } });
    expect(result.notes).toEqual(['Relic of the Past v0.1.0 does not fit Archipelago 0.6.7, so v0.2.0 was installed instead.']);
    expect(result.problems).toEqual([]);
  });

  test('a world with no recorded release is reinstalled from the newest stable and records its tag', async () => {
    await reinstallFrom(undefined, [{ tag: 'v0.3.0-rc1', prerelease: true, assets: oldAssets }, { tag: 'v0.2.0', assets: [MANIFEST, 'relic_of_the_past-ap0.6.7.apworld'] }]);
    expect(job()).toMatchObject({ version: '0.2.0', release: { tag: 'v0.2.0', prerelease: false } });
  });
});
