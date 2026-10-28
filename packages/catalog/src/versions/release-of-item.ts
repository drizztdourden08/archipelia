/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { ASSET_NAME, MAX_ASSETS, MAX_DATE_LENGTH, TAG_NAME } from './versions.constants';
import type { ReleaseAsset, ReleaseSummary } from './versions.type';

const assetOf = (value: unknown): ReleaseAsset[] =>
  (isRecord(value) && typeof value.id === 'number' && Number.isSafeInteger(value.id) && typeof value.name === 'string' && ASSET_NAME.test(value.name)
    ? [{ id: value.id, name: value.name }]
    : []);

const dateOf = (item: Record<string, unknown>): string => {
  const date = item.published_at ?? item.created_at;
  return typeof date === 'string' ? date.slice(0, MAX_DATE_LENGTH) : '';
};

const releaseOfItem = (item: unknown): ReleaseSummary[] => {
  if (!isRecord(item) || item.draft === true || typeof item.tag_name !== 'string' || !TAG_NAME.test(item.tag_name)) return [];
  const assets = Array.isArray(item.assets) ? (item.assets as unknown[]).slice(0, MAX_ASSETS).flatMap(assetOf) : [];
  return [{ tag: item.tag_name, prerelease: item.prerelease === true, publishedAt: dateOf(item), assets }];
};

export { releaseOfItem };
