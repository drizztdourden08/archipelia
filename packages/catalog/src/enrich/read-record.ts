/* @layer core @kind logic */
import type { DataFiles } from '@archipelia/model';
import type { EnrichRecord } from './enrich.type';
import { isEnrichRecord } from './is-enrich-record';
import { recordPath } from './record-path';

const readRecord = async (cache: DataFiles, apworld: string): Promise<EnrichRecord | undefined> => {
  const value = await cache.readJson<unknown>(recordPath(apworld), null).catch(() => null);
  return isEnrichRecord(value) ? value : undefined;
};

export { readRecord };
