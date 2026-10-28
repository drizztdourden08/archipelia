/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { DataFiles } from '@archipelia/model';
import { SEARCH_CACHE_FILE } from './ready.constants';
import type { ReadyCache, ReadyRepo } from './ready.type';

const isRepo = (value: unknown): value is ReadyRepo =>
  isRecord(value)
  && typeof value.id === 'number'
  && typeof value.fullName === 'string'
  && typeof value.owner === 'string'
  && typeof value.stars === 'number'
  && typeof value.pushedAt === 'string'
  && typeof value.createdAt === 'string'
  && typeof value.direct === 'boolean';

const readReadyCache = async (files: DataFiles): Promise<ReadyCache | null> => {
  const stored = await files.readJson<unknown>(SEARCH_CACHE_FILE, null).catch(() => null);
  if (!isRecord(stored) || typeof stored.fetchedAt !== 'number' || typeof stored.total !== 'number' || typeof stored.fetched !== 'number') return null;
  if (!Array.isArray(stored.repos) || !stored.repos.every(isRepo)) return null;
  return {
    fetchedAt: stored.fetchedAt, total: stored.total, fetched: stored.fetched, repos: stored.repos,
    ...(typeof stored.etag === 'string' ? { etag: stored.etag } : {}),
  };
};

export { readReadyCache };
