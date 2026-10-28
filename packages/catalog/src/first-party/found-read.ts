/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { readCapped } from '../enrich/read-capped';
import type { AssetRead } from './read-conditional-asset.type';

const parse = (url: string, bytes: Uint8Array): unknown => {
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error(`${url}: not JSON`);
  }
};

const foundRead = async (url: string, res: Response, max: number): Promise<AssetRead> => {
  const bytes = await readCapped(res, max);
  if (!bytes) throw new Error(`${url}: larger than ${max} bytes`);
  const value = parse(url, bytes);
  if (!isRecord(value)) throw new Error(`${url}: not a JSON object`);
  const tag = res.headers.get('etag');
  return { kind: 'found', value, ...(tag ? { etag: tag } : {}) };
};

export { foundRead };
