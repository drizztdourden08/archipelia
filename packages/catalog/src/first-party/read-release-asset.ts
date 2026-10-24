/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { NOT_FOUND } from './read-release-asset.constants';

const readReleaseAsset = async (url: string, request: typeof fetch): Promise<unknown> => {
  const res = await request(url, { redirect: 'follow' });
  if (res.status === NOT_FOUND) return null;
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const value: unknown = await res.json().catch(() => {
    throw new Error(`${url}: not JSON`);
  });
  if (!isRecord(value)) throw new Error(`${url}: not a JSON object`);
  return value;
};

export { readReleaseAsset };
