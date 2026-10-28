/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { DataFiles } from '@archipelia/model';
import { ASSET_NAME, RELEASES_FILE, TAG_NAME } from './versions.constants';
import type { StoredReleases } from './versions.type';

const isAsset = (value: unknown): boolean =>
  isRecord(value) && typeof value.id === 'number' && typeof value.name === 'string' && ASSET_NAME.test(value.name);

const isSummary = (value: unknown): boolean =>
  isRecord(value)
  && typeof value.tag === 'string'
  && TAG_NAME.test(value.tag)
  && typeof value.prerelease === 'boolean'
  && typeof value.publishedAt === 'string'
  && Array.isArray(value.assets)
  && value.assets.every(isAsset);

const isStored = (value: unknown): value is StoredReleases =>
  isRecord(value)
  && typeof value.fetchedAt === 'number'
  && (value.etag === undefined || typeof value.etag === 'string')
  && Array.isArray(value.releases)
  && value.releases.every(isSummary);

const readStoredReleases = async (files: DataFiles): Promise<Record<string, StoredReleases>> => {
  const stored = await files.readJson<unknown>(RELEASES_FILE, null).catch(() => null);
  if (!isRecord(stored)) return {};
  return Object.fromEntries(Object.entries(stored).filter((pair): pair is [string, StoredReleases] => isStored(pair[1])));
};

export { readStoredReleases };
