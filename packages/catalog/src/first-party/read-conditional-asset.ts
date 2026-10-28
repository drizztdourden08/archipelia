/* @layer core @kind logic */
import { foundRead } from './found-read';
import { MAX_ASSET_BYTES } from './read-release-asset.constants';
import type { AssetRead, AssetReadOptions } from './read-conditional-asset.type';
import { statusRead } from './status-read';

const readConditionalAsset = async (url: string, request: typeof fetch, options: AssetReadOptions = {}): Promise<AssetRead> => {
  const { etag, max = MAX_ASSET_BYTES } = options;
  const res = await request(url, { redirect: 'follow', ...(etag ? { headers: { 'if-none-match': etag } } : {}) });
  const early = statusRead(res, etag);
  if (early) return early;
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return foundRead(url, res, max);
};

export { readConditionalAsset };
