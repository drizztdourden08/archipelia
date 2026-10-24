/* @layer core @kind logic */
import { writeRegistryCache } from './write-registry-cache';
import type { RefreshRegistryParams, RegistryLoad } from './load-registry.type';

const refreshRegistry = async ({ files, stored, now, got }: RefreshRegistryParams): Promise<RegistryLoad> => {
  const fetchedAt = now();
  if (got.kind === 'fresh') {
    await writeRegistryCache(files, { etag: got.etag, fetchedAt, registry: got.raw });
    return { registry: got.registry, source: 'network', fetchedAt, problems: [] };
  }
  if (!stored) throw new Error('registry: not modified with nothing cached');
  await writeRegistryCache(files, { ...stored.cache, fetchedAt });
  return { registry: stored.registry, source: 'network', fetchedAt, problems: [] };
};

export { refreshRegistry };
