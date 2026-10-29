/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { DataFiles } from '@archipelia/model';
import type { ManifestCache, ManifestEntry } from './manifest-cache.type';
import { MANIFEST_CACHE_FILE } from './ready.constants';

const isOptional = (value: unknown, type: 'string' | 'boolean'): boolean => value === undefined || typeof value === type;

const isEntry = (value: unknown): value is ManifestEntry =>
  isRecord(value)
  && typeof value.repo === 'string'
  && typeof value.fetchedAt === 'number'
  && isOptional(value.etag, 'string')
  && isOptional(value.tag, 'string')
  && isOptional(value.checked, 'boolean')
  && (value.manifest === null || isRecord(value.manifest));

const readManifestCache = async (files: DataFiles): Promise<ManifestCache> => {
  const stored = await files.readJson<unknown>(MANIFEST_CACHE_FILE, null).catch(() => null);
  if (!isRecord(stored)) return {};
  return Object.fromEntries(Object.entries(stored).filter((pair): pair is [string, ManifestEntry] => isEntry(pair[1])));
};

export { readManifestCache };
