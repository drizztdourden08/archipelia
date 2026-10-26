/* @layer core @kind logic */
import type { EnrichRecord } from './enrich.type';
import { NEGATIVE_TTL_MS, TTL_MS } from './enrich.constants';

const isFresh = (record: EnrichRecord, stamp: string, now: number): boolean =>
  record.stamp === stamp && now - record.fetchedAt < (record.markdown ? TTL_MS : NEGATIVE_TTL_MS);

export { isFresh };
