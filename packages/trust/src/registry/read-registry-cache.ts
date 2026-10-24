/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { DataFiles } from '@archipelia/model';
import { parseRegistry } from './parse-registry';
import { REGISTRY_CACHE_FILE } from './registry.constants';
import type { RegistryCache } from './load-registry.type';
import type { Registry } from './registry.type';

const readRegistryCache = async (files: DataFiles): Promise<{ cache: RegistryCache; registry: Registry } | null> => {
  const stored = await files.readJson<unknown>(REGISTRY_CACHE_FILE, null);
  if (!isRecord(stored) || typeof stored.fetchedAt !== 'number') return null;
  const parsed = parseRegistry(stored.registry);
  if (!parsed.ok) return null;
  const etag = typeof stored.etag === 'string' ? stored.etag : null;
  return { cache: { etag, fetchedAt: stored.fetchedAt, registry: stored.registry }, registry: parsed.registry };
};

export { readRegistryCache };
