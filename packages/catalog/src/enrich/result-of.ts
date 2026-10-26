/* @layer core @kind logic */
import type { EnrichRecord, GameEnrichment } from './enrich.type';

const resultOf = (apworld: string, record: EnrichRecord | undefined): GameEnrichment | undefined => {
  if (!record?.markdown && !record?.art) return undefined;
  return {
    apworld,
    origin: record.stamp.startsWith('engine:') ? 'engine' : 'github',
    ...(record.markdown ? { markdown: record.markdown } : {}),
    ...(record.art ? { art: record.art } : {}),
  };
};

export { resultOf };
