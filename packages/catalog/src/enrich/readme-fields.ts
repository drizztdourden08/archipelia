/* @layer core @kind logic */
import type { EnrichRecord, ReadmeRead } from './enrich.type';
import { blocksOf } from './blocks-of';
import { introOf } from './intro-of';

const readmeFields = (read: ReadmeRead): Partial<EnrichRecord> => {
  if (read.kind !== 'text') return {};
  return { ...introOf(blocksOf(read.text)), readmeUrl: read.url, ...(read.etag ? { etag: read.etag } : {}) };
};

export { readmeFields };
