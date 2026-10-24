/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { BUNDLE_URL, MANIFEST_URL, REGISTRY_URL, WORLD_URL, communityEntry, json, manifestOf, missing, registryOf, routed, worldBytes } from './first-party.fixtures';
import { memoryFiles } from './memory-files.fixtures';

const readCatalog = vi.hoisted(() => vi.fn());
const apVersion = vi.hoisted(() => ({ value: '0.6.7' }));

vi.mock('../src/read-catalog', () => ({ readCatalog }));
vi.mock('@archipelia/engine', async (original) => ({
  ...(await original<object>()),
  readRuntime: () => Promise.resolve({ apVersion: apVersion.value }),
}));

const { createCatalogService } = await import('../src/service/create-catalog-service');

const serviceWith = (routes: Parameters<typeof routed>[0]) =>
  createCatalogService({ games: memoryFiles([]), cache: memoryFiles([]), engineDir: () => Promise.resolve('engine'), fetch: routed(routes) });

const bytes = worldBytes();

beforeEach(() => {
  apVersion.value = '0.6.7';
  readCatalog.mockResolvedValue({
    apVersion: '0.6.7',
    entries: [communityEntry('alpha'), communityEntry('relic_of_the_past', { displayName: 'Community Relic' })],
    problems: [],
    downloaded: 0,
  });
});

describe('catalog service with the first-party source', () => {
  test('lists the first-party game once, ahead of the community entry with the same module', async () => {
    const view = await serviceWith({ [REGISTRY_URL]: () => json(registryOf()), [MANIFEST_URL]: () => json(manifestOf(bytes)) }).read(false);
    const rows = view.entries.filter((entry) => entry.apworld === 'relic_of_the_past');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ source: 'first-party', displayName: 'Relic of the Past' });
    expect(view.entries.map((entry) => entry.apworld)).toContain('alpha');
    expect(rows[0]?.versions[0]?.url).toBe(WORLD_URL);
  });

  test('shows No release yet when the release has no manifest', async () => {
    const view = await serviceWith({ [REGISTRY_URL]: () => json(registryOf()), [MANIFEST_URL]: missing }).read(false);
    expect(view.entries.find((entry) => entry.apworld === 'relic_of_the_past')).toMatchObject({ unavailable: 'No release yet', versions: [] });
    expect(view.problems).toBe(0);
  });

  test('marks the entry not available for an engine outside its declared versions', async () => {
    apVersion.value = '0.6.2';
    const view = await serviceWith({ [REGISTRY_URL]: () => json(registryOf()), [MANIFEST_URL]: () => json(manifestOf(bytes)) }).read(false);
    expect(view.entries.find((entry) => entry.apworld === 'relic_of_the_past')?.unavailable).toBe(
      'Needs Archipelago 0.6.4 or newer, the active engine is 0.6.2',
    );
  });

  test('refuses to install an entry that is not in the catalog', async () => {
    const service = serviceWith({ [REGISTRY_URL]: () => json(registryOf()), [BUNDLE_URL]: missing, [MANIFEST_URL]: missing });
    await expect(service.install({ kind: 'index', apworld: 'nothing', version: '1' })).rejects.toThrow('nothing is not in the index');
  });

  test('says No release yet when asked to install a game with no release', async () => {
    const service = serviceWith({ [REGISTRY_URL]: () => json(registryOf()), [MANIFEST_URL]: missing });
    await expect(service.install({ kind: 'index', apworld: 'relic_of_the_past', version: '0.1.0' })).rejects.toThrow('Relic of the Past: No release yet');
  });
});
