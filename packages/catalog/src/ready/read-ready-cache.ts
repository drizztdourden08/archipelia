/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { DataFiles } from '@archipelia/model';
import { FULL_NAME, SEARCH_CACHE_FILE } from './ready.constants';
import type { ReadyCache, ReadyRepo } from './ready.type';

const hasIdentity = (value: Record<string, unknown>): boolean =>
  typeof value.id === 'number' && Number.isSafeInteger(value.id) && value.id > 0 && typeof value.fullName === 'string' && FULL_NAME.test(value.fullName);

const hasFacts = (value: Record<string, unknown>): boolean =>
  typeof value.owner === 'string' && typeof value.stars === 'number' && typeof value.pushedAt === 'string' && typeof value.createdAt === 'string' && typeof value.direct === 'boolean';

const isRepo = (value: unknown): value is ReadyRepo => isRecord(value) && hasIdentity(value) && hasFacts(value);

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
