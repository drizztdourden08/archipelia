/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { readCapped } from '../enrich/read-capped';
import { MAX_ASSET_BYTES, NOT_FOUND } from './read-release-asset.constants';

const parse = (url: string, bytes: Uint8Array): unknown => {
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error(`${url}: not JSON`);
  }
};

const readReleaseAsset = async (url: string, request: typeof fetch, max = MAX_ASSET_BYTES): Promise<unknown> => {
  const res = await request(url, { redirect: 'follow' });
  if (res.status === NOT_FOUND) return null;
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const bytes = await readCapped(res, max);
  if (!bytes) throw new Error(`${url}: larger than ${max} bytes`);
  const value = parse(url, bytes);
  if (!isRecord(value)) throw new Error(`${url}: not a JSON object`);
  return value;
};

export { readReleaseAsset };
