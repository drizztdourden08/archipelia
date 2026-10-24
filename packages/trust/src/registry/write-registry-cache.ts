/* @layer core @kind logic */
import type { DataFiles } from '@archipelia/model';
import { REGISTRY_CACHE_FILE } from './registry.constants';
import type { RegistryCache } from './load-registry.type';

const writeRegistryCache = (files: DataFiles, cache: RegistryCache) => files.writeJson(REGISTRY_CACHE_FILE, cache);

export { writeRegistryCache };
