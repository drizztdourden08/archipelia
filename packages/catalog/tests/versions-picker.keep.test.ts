/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { REGISTRY_URL, MANIFEST_URL, communityEntry, json, manifestOf, missing, registryOf, routed, worldBytes } from './first-party.fixtures';
import { memoryFiles } from './memory-files.fixtures';
import { SEARCH_URL, manifestRoute, readyManifest, searchOf } from './ready.fixtures';
import { downloadUrl, etagged, recording, releasesBody, releasesUrl } from './versions.fixtures';
import type { ReleaseSpec, Seen } from './versions.fixtures';

const stubs = vi.hoisted(() => ({ readCatalog: vi.fn(), installWorld: vi.fn(), apVersion: '0.6.7' }));
const { readCatalog, installWorld } = stubs;

vi.mock('@archipelia/engine', async (original) => ({ ...(await original<object>()), readRuntime: () => Promise.resolve({ apVersion: stubs.apVersion }) }));
vi.mock('../src/install/install-world', () => ({ installWorld: stubs.installWorld }));
vi.mock('../src/read-catalog', () => ({ readCatalog: stubs.readCatalog }));

const { createCatalogService } = await import('../src/service/create-catalog-service');

const REPO = 'maker/star-quest';

const ROTP = 'drizztdourden08/relic-of-the-past';

const STAR: ReleaseSpec[] = [
  { tag: 'v9.0.0', draft: true, assets: ['archipelia.json'] },
  { tag: 'v2.0.0-beta', prerelease: true, assets: ['archipelia.json', 'star_quest.apworld'] },
  { tag: 'v1.2.0', assets: ['archipelia.json', 'star_quest-ap0.6.8.apworld'] },
  { tag: 'v1.1.0', assets: ['archipelia.json', 'star_quest.apworld'] },
  { tag: 'v1.0.1', assets: ['archipelia.json', 'star_quest.apworld'] },
  { tag: 'v1.0.0', assets: ['archipelia.json', 'star_quest-ap0.6.7.apworld', 'star_quest-ap0.6.8.apworld'] },
  { tag: 'v0.9.0', assets: ['star_quest.apworld'] },
];

const sha = 'a'.repeat(64);

const at = (tag: string, manifest: unknown) => ({ [downloadUrl(REPO, tag, 'archipelia.json')]: () => json(manifest) });

const routes = (): Record<string, () => Response> => ({
  [REGISTRY_URL]: () => json(registryOf()),
  [MANIFEST_URL]: missing,
  [SEARCH_URL]: searchOf([{ id: 7, repo: REPO }]),
  [releasesUrl(REPO)]: () => json(releasesBody(STAR)),
  ...manifestRoute(REPO, readyManifest('Star Quest', 'star_quest')),
  ...at('v2.0.0-beta', readyManifest('Star Quest', 'star_quest', { worldVersion: '2.0.0-beta.1' })),
  ...at('v1.2.0', readyManifest('Star Quest', 'star_quest', {
    worldVersion: '1.2.0', world: undefined, builds: [{ archipelagoVersion: '0.6.8', file: 'star_quest-ap0.6.8.apworld', sha256: sha, size: 10 }],
  })),
  ...at('v1.1.0', readyManifest('Star Quest', 'star_quest', { worldVersion: '1.1.0' })),
  ...at('v1.0.1', readyManifest('Star Quest', 'other_world', { worldVersion: '1.0.1' })),
});

const serviceWith = (extra: Record<string, () => Response> = {}, cache = memoryFiles([]), seen: Seen[] = []) =>
  createCatalogService({
    games: memoryFiles([]), cache, engineDir: () => Promise.resolve('engine'), fetch: recording(routed({ ...routes(), ...extra }), seen),
  });

beforeEach(() => {
  installWorld.mockReset();
  installWorld.mockResolvedValue({ apworld: 'star_quest' });
  readCatalog.mockResolvedValue({
    apVersion: '0.6.7',
    entries: [communityEntry('alpha', { versions: [{ version: '1.0.0', url: 'u' }, { version: '1.10.0', url: 'u' }, { version: '1.2.0', url: 'u' }] })],
    problems: [],
    downloaded: 0,
  });
});

describe('the versions of a world found by its topic', () => {
  test('lists every release newest first, tags the pre-release and disables what the engine cannot use', async () => {
    const list = await serviceWith().versions({ apworld: 'star_quest', source: 'first-party' });
    expect(list.by).toBe('tag');
    expect(list.choices.map((choice) => choice.id)).toEqual(['v2.0.0-beta', 'v1.2.0', 'v1.1.0', 'v1.0.1', 'v1.0.0', 'v0.9.0']);
    const [beta, newest, older, odd, builds, bare] = list.choices;
    expect(beta).toMatchObject({ prerelease: true, version: '2.0.0-beta.1' });
    expect(beta?.reason).toBeUndefined();
    expect(newest?.reason).toBe('No build for Archipelago 0.6.7; builds exist for 0.6.8');
    expect(older).toMatchObject({ prerelease: false, version: '1.1.0' });
    expect(older?.reason).toBeUndefined();
    expect(odd?.reason).toMatch(/lists another world/);
    expect(builds?.reason).toBeUndefined();
    expect(bare?.reason).toBe('This release has no archipelia.json');
  });

  test('the default is the newest stable release the engine can use, and latest is the newest stable', async () => {
    const list = await serviceWith().versions({ apworld: 'star_quest', source: 'first-party' });
    expect(list.defaultId).toBe('v1.1.0');
    expect(list.latestId).toBe('v1.2.0');
  });

  test('makes one call to the releases list per open, then asks again with the saved ETag and takes the 304', async () => {
    const seen: Seen[] = [];
    const cache = memoryFiles([]);
    const body = releasesBody(STAR);
    const make = () => createCatalogService({
      games: memoryFiles([]), cache, engineDir: () => Promise.resolve('engine'),
      fetch: recording(etagged(routed(routes()), releasesUrl(REPO), body, '"v1"'), seen),
    });
    const first = make();
    await first.versions({ apworld: 'star_quest', source: 'first-party' });
    await first.versions({ apworld: 'star_quest', source: 'first-party' });
    expect(seen.filter((call) => call.url === releasesUrl(REPO))).toHaveLength(1);
    const again = await make().versions({ apworld: 'star_quest', source: 'first-party' });
    expect(seen.filter((call) => call.url === releasesUrl(REPO)).map((call) => call.etag)).toEqual([undefined, '"v1"']);
    expect(again.choices).toHaveLength(6);
  });

  test('a limit answer keeps the saved list and says when to try again', async () => {
    const cache = memoryFiles([]);
    await serviceWith({}, cache).versions({ apworld: 'star_quest', source: 'first-party' });
    const reset = Math.floor(Date.now() / 1000) + 3600;
    const limited = { [releasesUrl(REPO)]: () => new Response('{}', { status: 403, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(reset) } }) };
    const list = await serviceWith(limited, cache).versions({ apworld: 'star_quest', source: 'first-party' });
    expect(list.choices).toHaveLength(6);
    expect(list.problem).toMatch(/GitHub asks Archipelia to wait/);
    const cold = await serviceWith(limited).versions({ apworld: 'star_quest', source: 'first-party' });
    expect(cold.choices).toEqual([]);
    expect(cold.problem).toMatch(/GitHub asks Archipelia to wait/);
  });

  test('an older release is read once and kept for good by its asset id', async () => {
    const seen: Seen[] = [];
    const cache = memoryFiles([]);
    await serviceWith({}, cache, seen).versions({ apworld: 'star_quest', source: 'first-party' });
    const reads = () => seen.filter((call) => call.url === downloadUrl(REPO, 'v1.1.0', 'archipelia.json')).length;
    expect(reads()).toBe(1);
    await serviceWith({}, cache, seen).versions({ apworld: 'star_quest', source: 'first-party' });
    expect(reads()).toBe(1);
  });
});

describe('the versions of a listed world and of an index world', () => {
  test('a listed world reads the old manifest name of an older release', async () => {
    const bytes = worldBytes();
    const list = await serviceWith({
      [releasesUrl(ROTP)]: () => json(releasesBody([
        { tag: 'v0.3.0', assets: ['relic_of_the_past.apworld.json'] },
        { tag: 'v0.2.0', assets: ['relic_of_the_past.apworld.json'] },
      ])),
      [downloadUrl(ROTP, 'v0.3.0', 'relic_of_the_past.apworld.json')]: () => json(manifestOf(bytes, { worldVersion: '0.3.0', minimumAp: '0.7.0' })),
      [downloadUrl(ROTP, 'v0.2.0', 'relic_of_the_past.apworld.json')]: () => json(manifestOf(bytes, { worldVersion: '0.2.0' })),
    }).versions({ apworld: 'relic_of_the_past', source: 'first-party' });
    expect(list.choices.map((choice) => [choice.id, choice.version, choice.reason ? 'blocked' : 'open'])).toEqual([
      ['v0.3.0', '0.3.0', 'blocked'], ['v0.2.0', '0.2.0', 'open'],
    ]);
    expect(list.choices[0]?.reason).toMatch(/Needs Archipelago 0.7.0 or newer/);
    expect(list.defaultId).toBe('v0.2.0');
  });

  test('an index world lists its versions newest first at no network cost', async () => {
    const seen: Seen[] = [];
    const list = await serviceWith({}, memoryFiles([]), seen).versions({ apworld: 'alpha', source: 'index' });
    expect(list).toMatchObject({ by: 'version', defaultId: '1.10.0', latestId: '1.10.0' });
    expect(list.choices.map((choice) => choice.id)).toEqual(['1.10.0', '1.2.0', '1.0.0']);
    expect(seen.filter((call) => call.url.startsWith('https://api.github.com/repos'))).toEqual([]);
  });

  test('a built-in world has no versions to pick', async () => {
    expect(await serviceWith().versions({ apworld: 'apquest', source: 'official' })).toEqual({ by: 'version', choices: [] });
  });
});

describe('adding a chosen release', () => {
  const accept = { kind: 'index' as const, apworld: 'star_quest', version: '', acceptRepoId: 7 };

  test('downloads from the tag, records the release and its pre-release flag', async () => {
    await serviceWith().install({ ...accept, tag: 'v2.0.0-beta' });
    const call = installWorld.mock.calls[0]?.[0] as { entry: { versions: { url: string }[] }; version: string; release: unknown };
    expect(call.entry.versions[0]?.url).toBe(downloadUrl(REPO, 'v2.0.0-beta', 'star_quest.apworld'));
    expect(call.version).toBe('2.0.0-beta.1');
    expect(call.release).toEqual({ tag: 'v2.0.0-beta', prerelease: true });
  });

  test('a stable release is recorded as not a pre-release', async () => {
    await serviceWith().install({ ...accept, tag: 'v1.1.0' });
    expect((installWorld.mock.calls[0]?.[0] as { release: unknown }).release).toEqual({ tag: 'v1.1.0', prerelease: false });
  });

  test('a release the engine cannot use, an unknown tag and another world are refused', async () => {
    await expect(serviceWith().install({ ...accept, tag: 'v1.2.0' })).rejects.toThrow(/No Star Quest build for Archipelago 0.6.7/);
    await expect(serviceWith().install({ ...accept, tag: 'v7.7.7' })).rejects.toThrow(/is not a release of/);
    await expect(serviceWith().install({ ...accept, tag: 'v1.0.1' })).rejects.toThrow(/lists another world/);
    expect(installWorld).not.toHaveBeenCalled();
  });

  test('without a tag the install is the newest stable, as the card does, and records its tag', async () => {
    await serviceWith().install(accept);
    const call = installWorld.mock.calls[0]?.[0] as { entry: { versions: { url: string }[] }; release?: unknown };
    expect(call.entry.versions[0]?.url).toBe(`https://github.com/${REPO}/releases/latest/download/star_quest.apworld`);
    expect(call.release).toEqual({ tag: 'v1.2.0', prerelease: false });
  });

  test('the default install still goes ahead when the releases list cannot be read', async () => {
    await serviceWith({ [releasesUrl(REPO)]: () => new Response('', { status: 500 }) }).install(accept);
    expect(installWorld).toHaveBeenCalledOnce();
    expect((installWorld.mock.calls[0]?.[0] as { release?: unknown }).release).toBeUndefined();
  });

  test('a tag that is not one of the repository releases never reaches a URL', async () => {
    for (const tag of ['../../evil/repo/releases/download/v1', 'v1.1.0/../v9', 'v1.1.0?x=1', 'V1.1.0', '']) {
      await expect(serviceWith().install({ ...accept, tag })).rejects.toThrow();
    }
    expect(installWorld).not.toHaveBeenCalled();
  });
});
