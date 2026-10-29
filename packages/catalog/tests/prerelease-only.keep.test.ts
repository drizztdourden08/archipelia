/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MANIFEST_URL, REGISTRY_URL, STANDARD_URL, communityEntry, json, missing, registryOf, routed, standardOf, worldBytes } from './first-party.fixtures';
import { memoryFiles } from './memory-files.fixtures';
import { SEARCH_URL, manifestUrl, noManifest, readyManifest, searchOf } from './ready.fixtures';
import { downloadUrl, recording, releasesBody, releasesUrl } from './versions.fixtures';
import type { ReleaseSpec, Seen } from './versions.fixtures';

const ENGINE_AP = '0.6.7';
const installWorld = vi.hoisted(() => vi.fn());
const readCatalog = vi.hoisted(() => vi.fn());

vi.mock('@archipelia/engine', async (original) => ({ ...(await original<object>()), readRuntime: () => Promise.resolve({ apVersion: ENGINE_AP }) }));
vi.mock('../src/install/install-world', () => ({ installWorld }));
vi.mock('../src/read-catalog', () => ({ readCatalog }));

const { createCatalogService } = await import('../src/service/create-catalog-service');

const REPO = 'drizztdourden08/relic-of-the-past';

const ASSETS = ['archipelia.json', 'relic_of_the_past.apworld', 'relic_of_the_past.apworld.sigstore.json'];

const bytes = worldBytes();

const LATEST = [{ tag: 'v0.21.2', prerelease: true, assets: ASSETS }, { tag: 'v0.21.1', prerelease: true, assets: ASSETS }];

const MIXED = [{ tag: 'v0.22.0-rc1', prerelease: true, assets: ASSETS }, { tag: 'v0.21.1', assets: ASSETS }];

const STABLE = [{ tag: 'v0.21.1', assets: ASSETS }, { tag: 'v0.21.0', assets: ASSETS }];

const manifestAt = (tag: string, worldVersion: string) => ({ [downloadUrl(REPO, tag, 'archipelia.json')]: () => json(standardOf(bytes, { worldVersion, appVersion: worldVersion })) });

const routesFor = (releases: ReleaseSpec[], hasLatest: boolean): Record<string, () => Response> => ({
  [REGISTRY_URL]: () => json(registryOf()),
  [MANIFEST_URL]: missing,
  [STANDARD_URL]: hasLatest ? () => json(standardOf(bytes, { worldVersion: '0.21.1', appVersion: '0.21.1' })) : missing,
  [releasesUrl(REPO)]: () => json(releasesBody(releases)),
  ...manifestAt('v0.21.2', '0.21.2'),
  ...manifestAt('v0.22.0-rc1', '0.22.0-rc1'),
  ...manifestAt('v0.21.1', '0.21.1'),
  ...manifestAt('v0.21.0', '0.21.0'),
});

const serviceWith = (releases: ReleaseSpec[], hasLatest: boolean, seen: Seen[] = []) =>
  createCatalogService({
    games: memoryFiles([]), cache: memoryFiles([]), engineDir: () => Promise.resolve('engine'), fetch: recording(routed(routesFor(releases, hasLatest)), seen),
  });

const rotp = async (service: ReturnType<typeof serviceWith>) => (await service.read(false)).entries.find((entry) => entry.apworld === 'relic_of_the_past');

const key = { apworld: 'relic_of_the_past', source: 'first-party' as const };

beforeEach(() => {
  installWorld.mockReset();
  installWorld.mockResolvedValue({ apworld: 'relic_of_the_past' });
  readCatalog.mockResolvedValue({ apVersion: ENGINE_AP, entries: [communityEntry('alpha')], problems: [], downloaded: 0 });
});

describe('a world with no stable release', () => {
  test('the card reads the newest pre-release by its tag and marks it a pre-release', async () => {
    const entry = await rotp(serviceWith(LATEST, false));
    expect(entry?.firstParty).toMatchObject({
      prerelease: true, tag: 'v0.21.2', bundleUrl: downloadUrl(REPO, 'v0.21.2', 'relic_of_the_past.apworld.sigstore.json'),
    });
    expect(entry?.versions[0]).toMatchObject({ version: '0.21.2', url: downloadUrl(REPO, 'v0.21.2', 'relic_of_the_past.apworld') });
    expect(entry?.unavailable).toBeUndefined();
  });

  test('the picker defaults to the newest pre-release, which is also the latest', async () => {
    const list = await serviceWith(LATEST, false).versions(key);
    expect(list).toMatchObject({ defaultId: 'v0.21.2', latestId: 'v0.21.2' });
    expect(list.choices.map((choice) => choice.id)).toEqual(['v0.21.2', 'v0.21.1']);
  });

  test('the default install downloads by the tag and records the pre-release', async () => {
    const service = serviceWith(LATEST, false);
    await service.install({ kind: 'index', apworld: 'relic_of_the_past', version: '' });
    const call = installWorld.mock.calls[0]?.[0] as { entry: { versions: { url: string }[] }; release: unknown; version: string };
    expect(call.entry.versions[0]?.url).toBe(downloadUrl(REPO, 'v0.21.2', 'relic_of_the_past.apworld'));
    expect(call.version).toBe('0.21.2');
    expect(call.release).toEqual({ tag: 'v0.21.2', prerelease: true });
  });

  test('a world with no release at all stays No release yet', async () => {
    const entry = await rotp(serviceWith([], false));
    expect(entry).toMatchObject({ unavailable: 'No release yet', versions: [] });
    expect(entry?.firstParty?.prerelease).toBeUndefined();
  });
});

describe('a world with a stable release', () => {
  test('mixed: the card keeps the latest stable and the pre-release is only in the picker', async () => {
    const seen: Seen[] = [];
    const service = serviceWith(MIXED, true, seen);
    const entry = await rotp(service);
    expect(entry?.versions[0]?.url).toBe('https://github.com/drizztdourden08/relic-of-the-past/releases/latest/download/relic_of_the_past.apworld');
    expect(entry?.firstParty?.prerelease).toBeUndefined();
    expect(seen.some((call) => call.url.startsWith('https://api.github.com/repos/'))).toBe(false);
    const list = await service.versions(key);
    expect(list).toMatchObject({ defaultId: 'v0.21.1', latestId: 'v0.21.1' });
    expect(list.choices.map((choice) => [choice.id, choice.prerelease])).toEqual([['v0.22.0-rc1', true], ['v0.21.1', false]]);
  });

  test('stable only: nothing changes, and the default is the newest stable', async () => {
    const service = serviceWith(STABLE, true);
    expect((await rotp(service))?.firstParty?.prerelease).toBeUndefined();
    expect(await service.versions(key)).toMatchObject({ defaultId: 'v0.21.1', latestId: 'v0.21.1' });
    await service.install({ kind: 'index', apworld: 'relic_of_the_past', version: '' });
    expect((installWorld.mock.calls[0]?.[0] as { release: unknown }).release).toEqual({ tag: 'v0.21.1', prerelease: false });
  });
});

describe('a world found by its topic', () => {
  const TOPIC = 'maker/star-quest';

  const topicService = (releases: ReleaseSpec[], hasLatest: boolean) =>
    createCatalogService({
      games: memoryFiles([]),
      cache: memoryFiles([]),
      engineDir: () => Promise.resolve('engine'),
      fetch: routed({
        [REGISTRY_URL]: () => json(registryOf()),
        [MANIFEST_URL]: missing,
        [SEARCH_URL]: searchOf([{ id: 7, repo: TOPIC }]),
        [releasesUrl(TOPIC)]: () => json(releasesBody(releases)),
        ...(hasLatest ? { [manifestUrl(TOPIC)]: () => json(readyManifest('Star Quest', 'star_quest')) } : noManifest(TOPIC)),
        [downloadUrl(TOPIC, 'v2.0.0-rc1', 'archipelia.json')]: () => json(readyManifest('Star Quest', 'star_quest', { worldVersion: '2.0.0-rc1' })),
      }),
    });

  const starQuest = async (service: ReturnType<typeof topicService>) => (await service.read(false)).entries.find((entry) => entry.apworld === 'star_quest');

  const RC = [{ tag: 'v2.0.0-rc1', prerelease: true, assets: ['archipelia.json', 'star_quest.apworld'] }];

  test('with only pre-releases it resolves from the newest one by tag and carries the Pre-release mark', async () => {
    const entry = await starQuest(topicService(RC, false));
    expect(entry?.discovered).toMatchObject({ repoId: 7, repo: TOPIC });
    expect(entry?.firstParty).toMatchObject({ prerelease: true, tag: 'v2.0.0-rc1' });
    expect(entry?.versions[0]).toMatchObject({ version: '2.0.0-rc1', url: downloadUrl(TOPIC, 'v2.0.0-rc1', 'star_quest.apworld') });
  });

  test('with a stable release it keeps latest and no mark', async () => {
    const entry = await starQuest(topicService([{ tag: 'v1.0.0', assets: ['archipelia.json'] }, ...RC], true));
    expect(entry?.firstParty?.prerelease).toBeUndefined();
    expect(entry?.versions[0]?.url).toBe(`https://github.com/${TOPIC}/releases/latest/download/star_quest.apworld`);
  });

  test('with no release at all it is not shown', async () => {
    expect(await starQuest(topicService([], false))).toBeUndefined();
  });

  test('only the five most recently updated repos without a latest manifest are resolved per refresh, the rest on the next one', async () => {
    const repos = Array.from({ length: 7 }, (_, i) => ({ id: i + 1, repo: `maker/world-${i}`, pushedAt: `2026-10-0${i + 1}T00:00:00Z` }));
    const rc = [{ tag: 'v1.0.0-rc1', prerelease: true, assets: ['archipelia.json'] }];
    const seen: Seen[] = [];
    const service = createCatalogService({
      games: memoryFiles([]),
      cache: memoryFiles([]),
      engineDir: () => Promise.resolve('engine'),
      fetch: recording(routed({
        [REGISTRY_URL]: () => json(registryOf()),
        [MANIFEST_URL]: missing,
        [SEARCH_URL]: searchOf(repos),
        ...Object.fromEntries(repos.flatMap(({ repo }, i) => [
          ...Object.entries(noManifest(repo)),
          [releasesUrl(repo), () => json(releasesBody(rc))],
          [downloadUrl(repo, 'v1.0.0-rc1', 'archipelia.json'), () => json(readyManifest(`World ${i}`, `world_${i}`, { worldVersion: '1.0.0-rc1' }))],
        ])),
      }), seen),
    });
    const shown = async (force: boolean) => (await service.read(force)).entries.filter((entry) => entry.discovered).map((entry) => entry.apworld).sort();
    const calls = () => seen.filter((call) => call.url.includes('/repos/maker/world-')).length;
    expect(await shown(false)).toEqual(['world_2', 'world_3', 'world_4', 'world_5', 'world_6']);
    expect(calls()).toBe(5);
    expect(await shown(true)).toHaveLength(7);
    expect(calls()).toBe(7);
  });
});
