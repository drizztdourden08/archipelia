/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { CatalogEntry } from '@archipelia/model';
import { MANIFEST_URL, REGISTRY_URL, communityEntry, json, missing, registryOf, routed } from './first-party.fixtures';
import { memoryFiles } from './memory-files.fixtures';
import { SEARCH_URL, manifestRoute, manifestUrl, noManifest, readyManifest, searchOf } from './ready.fixtures';

const readCatalog = vi.hoisted(() => vi.fn());
const installWorld = vi.hoisted(() => vi.fn());

vi.mock('../src/read-catalog', () => ({ readCatalog }));
vi.mock('../src/install/install-world', () => ({ installWorld }));
vi.mock('@archipelia/engine', async (original) => ({
  ...(await original<object>()),
  readRuntime: () => Promise.resolve({ apVersion: '0.6.7' }),
}));

const { createCatalogService } = await import('../src/service/create-catalog-service');

const REPO = 'drizztdourden08/relic-of-the-past';

const registry = (patch: { repoId?: number; blocked?: { repoId: number }[] } = {}) => {
  const base = registryOf();
  const [game] = base.games;
  if (game && patch.repoId !== undefined) game.release = { ...game.release, repoId: patch.repoId } as typeof game.release;
  return { ...base, ...(patch.blocked ? { blocked: patch.blocked } : {}) };
};

const serviceWith = (routes: Parameters<typeof routed>[0], files = memoryFiles([]), cache = memoryFiles([])) =>
  createCatalogService({ games: files, cache, engineDir: () => Promise.resolve('engine'), fetch: routed({ [REGISTRY_URL]: () => json(registry()), [MANIFEST_URL]: missing, ...routes }) });

const find = (entries: CatalogEntry[], apworld: string) => entries.filter((entry) => entry.apworld === apworld);

beforeEach(() => {
  installWorld.mockReset();
  readCatalog.mockResolvedValue({
    apVersion: '0.6.7',
    entries: [
      communityEntry('alpha', { home: 'https://github.com/someone/alpha', setupGuide: 'https://guide/alpha', tags: ['puzzle'] }),
      communityEntry('relic_of_the_past'),
    ],
    problems: [],
    downloaded: 0,
  });
});

describe('Archipelia ready worlds found by their topic', () => {
  test('a tagged repo with a manifest is listed as an unreviewed Archipelia ready world', async () => {
    const view = await serviceWith({
      [SEARCH_URL]: searchOf([{ id: 7, repo: 'maker/star-quest', stars: 12 }]),
      ...manifestRoute('maker/star-quest', readyManifest('Star Quest', 'star_quest')),
    }).read(false);
    const [entry] = find(view.entries, 'star_quest');
    expect(entry).toMatchObject({ source: 'first-party', game: 'Star Quest', displayName: 'Star Quest', home: 'https://github.com/maker/star-quest' });
    expect(entry?.discovered).toMatchObject({ repoId: 7, repo: 'maker/star-quest', owner: 'maker', stars: 12, direct: false });
    expect(entry?.firstParty).toMatchObject({ repo: 'maker/star-quest' });
    expect(entry?.firstParty?.client).toBeUndefined();
    expect(entry?.versions[0]).toMatchObject({ version: '1.0.0', url: 'https://github.com/maker/star-quest/releases/latest/download/star_quest.apworld' });
  });

  test('a repo with no manifest, no stable release or a bad manifest is not shown', async () => {
    const view = await serviceWith({
      [SEARCH_URL]: searchOf([{ id: 1, repo: 'a/none' }, { id: 2, repo: 'b/bad' }, { id: 3, repo: 'c/huge' }, { id: 4, repo: 'd/path' }]),
      ...noManifest('a/none'),
      ...manifestRoute('b/bad', { format: 1, game: 'Bad' }),
      ...manifestRoute('c/huge', readyManifest('Huge', 'huge', { world: { file: 'huge.apworld', sha256: 'a'.repeat(64), size: 65 * 1024 * 1024 } })),
      ...manifestRoute('d/path', readyManifest('Path', '../evil')),
    }).read(false);
    expect(view.entries.filter((entry) => entry.discovered)).toEqual([]);
    expect(view.problems).toBe(0);
  });

});

describe('Archipelia ready worlds and the registry', () => {
  test('a repo that is in the registry is not listed twice, and its id decides, not its name', async () => {
    const same = await serviceWith({
      [REGISTRY_URL]: () => json(registry({ repoId: 55 })),
      [SEARCH_URL]: searchOf([{ id: 55, repo: REPO }]),
      ...manifestRoute(REPO, readyManifest('Relic of the Past', 'relic_of_the_past')),
    }).read(false);
    expect(find(same.entries, 'relic_of_the_past')).toHaveLength(1);
    expect(find(same.entries, 'relic_of_the_past')[0]?.discovered).toBeUndefined();
    const swapped = await serviceWith({
      [REGISTRY_URL]: () => json(registry({ repoId: 55 })),
      [SEARCH_URL]: searchOf([{ id: 99, repo: REPO }]),
      ...manifestRoute(REPO, readyManifest('Relic of the Past', 'relic_of_the_past')),
    }).read(false);
    expect(find(swapped.entries, 'relic_of_the_past')).toHaveLength(1);
    expect(find(swapped.entries, 'relic_of_the_past')[0]?.discovered).toBeUndefined();
    expect(swapped.problems).toBe(1);
  });

  test('a repo that claims the module or the game of a listed world is hidden and reported', async () => {
    const view = await serviceWith({
      [SEARCH_URL]: searchOf([{ id: 8, repo: 'thief/copy', stars: 900 }, { id: 9, repo: 'thief/renamed', stars: 900 }]),
      ...manifestRoute('thief/copy', readyManifest('Fake', 'relic_of_the_past')),
      ...manifestRoute('thief/renamed', readyManifest('Relic of the Past', 'other_module')),
    }).read(false);
    expect(find(view.entries, 'relic_of_the_past')).toHaveLength(1);
    expect(find(view.entries, 'relic_of_the_past')[0]?.source).toBe('first-party');
    expect(find(view.entries, 'other_module')).toEqual([]);
    expect(view.problems).toBe(2);
  });

});

describe('Archipelia ready worlds and the Archipelago index', () => {
  test('a repo that is the home of the index entry becomes one card that keeps the index guide', async () => {
    const view = await serviceWith({
      [SEARCH_URL]: searchOf([{ id: 11, repo: 'someone/alpha' }]),
      ...manifestRoute('someone/alpha', readyManifest('alpha', 'alpha')),
    }).read(false);
    const rows = find(view.entries, 'alpha');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ source: 'first-party', setupGuide: 'https://guide/alpha', tags: ['puzzle'] });
    expect(rows[0]?.discovered).toMatchObject({ repoId: 11, alsoInIndex: true });
  });

  test('a repo that claims an index module from another home is hidden', async () => {
    const view = await serviceWith({
      [SEARCH_URL]: searchOf([{ id: 12, repo: 'other/alpha' }]),
      ...manifestRoute('other/alpha', readyManifest('alpha', 'alpha')),
    }).read(false);
    expect(find(view.entries, 'alpha')).toHaveLength(1);
    expect(find(view.entries, 'alpha')[0]?.source).toBe('index');
    expect(view.problems).toBe(1);
  });

  test('two repos for one module: the one with more stars stays, then the older one', async () => {
    const view = await serviceWith({
      [SEARCH_URL]: searchOf([{ id: 20, repo: 'a/one', stars: 1 }, { id: 21, repo: 'b/two', stars: 5 }, { id: 22, repo: 'c/three', stars: 5, createdAt: '2025-01-01T00:00:00Z' }]),
      ...manifestRoute('a/one', readyManifest('Twin', 'twin')),
      ...manifestRoute('b/two', readyManifest('Twin', 'twin')),
      ...manifestRoute('c/three', readyManifest('Twin', 'twin')),
    }).read(false);
    expect(find(view.entries, 'twin').map((entry) => entry.discovered?.repo)).toEqual(['c/three']);
    expect(view.problems).toBe(2);
  });

});

describe('Archipelia ready worlds, blocking and limits', () => {
  test('a blocked repo id is hidden for everyone and its manifest is never read', async () => {
    const reads: string[] = [];
    const view = await serviceWith({
      [REGISTRY_URL]: () => json(registry({ blocked: [{ repoId: 30 }] })),
      [SEARCH_URL]: searchOf([{ id: 30, repo: 'spam/world' }]),
      [manifestUrl('spam/world')]: () => { reads.push('read'); return json(readyManifest('Spam', 'spam')); },
    }).read(false);
    expect(find(view.entries, 'spam')).toEqual([]);
    expect(reads).toEqual([]);
    expect(view.problems).toBe(0);
  });

  test('says how many were shown when GitHub has more than the search returned', async () => {
    const view = await serviceWith({ [SEARCH_URL]: searchOf([{ id: 1, repo: 'a/b' }], 742), ...noManifest('a/b') }).read(false);
    expect(view.ready).toEqual({ total: 742, shown: 1 });
  });

  test('a rate limited search shows the notice and keeps the saved worlds', async () => {
    const reset = Math.floor(Date.now() / 1000) + 3600;
    const cache = memoryFiles([]);
    const routes = { [SEARCH_URL]: searchOf([{ id: 7, repo: 'maker/star-quest' }]), ...manifestRoute('maker/star-quest', readyManifest('Star Quest', 'star_quest')) };
    await serviceWith(routes, memoryFiles([]), cache).read(false);
    await cache.writeJson('ready-search.json', { ...(await cache.readJson<object>('ready-search.json', {})), fetchedAt: 1 });
    const limit = { [SEARCH_URL]: () => new Response('{}', { status: 403, headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(reset) } }) };
    const limited = serviceWith({ ...routes, ...limit }, memoryFiles([]), cache);
    const view = await limited.read(false);
    expect(find(view.entries, 'star_quest')).toHaveLength(1);
    expect(view.limited?.limitedUntil).toBe(reset * 1000);
  });
});

describe('adding a world found by its topic', () => {
  const routes = {
    [SEARCH_URL]: searchOf([{ id: 7, repo: 'maker/star-quest' }]),
    ...manifestRoute('maker/star-quest', readyManifest('Star Quest', 'star_quest')),
  };

  test('is refused until the person accepts that repository', async () => {
    await expect(serviceWith(routes).install({ kind: 'index', apworld: 'star_quest', version: '1.0.0' })).rejects.toThrow(/has not reviewed/);
    await expect(serviceWith(routes).install({ kind: 'index', apworld: 'star_quest', version: '1.0.0', acceptRepoId: 8 })).rejects.toThrow(/has not reviewed/);
    expect(installWorld).not.toHaveBeenCalled();
  });

  test('goes ahead once the repository id is accepted', async () => {
    installWorld.mockResolvedValue({ apworld: 'star_quest' });
    await serviceWith(routes).install({ kind: 'index', apworld: 'star_quest', version: '1.0.0', acceptRepoId: 7 });
    expect(installWorld).toHaveBeenCalledOnce();
  });

  test('an update of a world already accepted from the same repository does not ask again', async () => {
    installWorld.mockResolvedValue({ apworld: 'star_quest' });
    const files = memoryFiles([{ apworld: 'star_quest', origin: { repoId: 7, repo: 'maker/star-quest' } } as never]);
    await serviceWith(routes, files).install({ kind: 'index', apworld: 'star_quest', version: '1.0.0' });
    expect(installWorld).toHaveBeenCalledOnce();
  });

  test('a repository that moved to another owner asks again', async () => {
    const files = memoryFiles([{ apworld: 'star_quest', origin: { repoId: 7, repo: 'someone-else/star-quest' } } as never]);
    await expect(serviceWith(routes, files).install({ kind: 'index', apworld: 'star_quest', version: '1.0.0' })).rejects.toThrow(/has not reviewed/);
    expect(installWorld).not.toHaveBeenCalled();
  });
});
