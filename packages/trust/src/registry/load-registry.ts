/* @layer core @kind logic */
import { fetchRegistry } from './fetch-registry';
import { floorRegistry } from './floor-registry';
import { readRegistryCache } from './read-registry-cache';
import { refreshRegistry } from './refresh-registry';
import { registryFallback } from './registry-fallback';
import { registryIsFresh } from './registry-is-fresh';
import type { LoadRegistryDeps, LoadRegistryOptions, RegistryLoad } from './load-registry.type';

const loadRegistry = async (deps: LoadRegistryDeps, options: LoadRegistryOptions = {}): Promise<RegistryLoad> => {
  const { files, fetch: fetchFn = fetch, now = Date.now, url, floor = floorRegistry } = deps;
  const stored = await readRegistryCache(files);
  if (stored && registryIsFresh(stored.cache.fetchedAt, now(), options.force)) {
    return { registry: stored.registry, source: 'cache', fetchedAt: stored.cache.fetchedAt, problems: [] };
  }
  try {
    const got = await fetchRegistry(fetchFn, stored?.cache.etag ?? null, url);
    return await refreshRegistry({ files, stored, now, got });
  } catch (error) {
    return registryFallback({ stored, floor, error });
  }
};

export { loadRegistry };
