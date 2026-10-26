/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { AssetFact, ReleaseFact } from './wheel.type';
import { ASSET_NAME, DIGEST, MAX_WHEEL_BYTES, TAG_NAME } from './wheel.constants';

const digestOf = (value: unknown): string | undefined => (typeof value === 'string' ? DIGEST.exec(value)?.[1]?.toLowerCase() : undefined);

const assetOf = (value: unknown): AssetFact | undefined => {
  if (!isRecord(value) || typeof value.name !== 'string' || !ASSET_NAME.test(value.name)) return undefined;
  const { size, state } = value;
  if (typeof size !== 'number' || !Number.isInteger(size) || size <= 0 || size > MAX_WHEEL_BYTES) return undefined;
  if (state !== undefined && state !== 'uploaded') return undefined;
  return { name: value.name, size, digest: digestOf(value.digest) };
};

const releaseOf = (value: unknown): ReleaseFact | undefined => {
  if (!isRecord(value) || value.draft === true || typeof value.tag_name !== 'string' || !TAG_NAME.test(value.tag_name)) return undefined;
  const assets = Array.isArray(value.assets) ? value.assets.map(assetOf).filter((asset): asset is AssetFact => asset !== undefined) : [];
  return { tag: value.tag_name, prerelease: value.prerelease === true, assets };
};

const releasesOf = (body: unknown): ReleaseFact[] =>
  (Array.isArray(body) ? body.map(releaseOf).filter((release): release is ReleaseFact => release !== undefined) : []);

export { releasesOf };
