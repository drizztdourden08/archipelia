/* @layer core @kind logic */
import type { EnrichRecord, GameEnrichment } from './enrich.type';

const resultOf = (apworld: string, record: EnrichRecord | undefined): GameEnrichment | undefined => {
  if (!record?.summary) return undefined;
  return {
    apworld,
    summary: record.summary,
    origin: record.stamp.startsWith('engine:') ? 'engine' : 'github',
    ...(record.details ? { details: record.details } : {}),
    ...(record.art ? { art: record.art } : {}),
  };
};

export { resultOf };
