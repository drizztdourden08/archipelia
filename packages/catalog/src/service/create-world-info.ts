/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import type { EnrichRequest, GameEnrichment } from '../enrich/enrich.type';
import type { WorldInfo } from '../source/source.type';

const createWorldInfo = (
  indexEntry: (apworld: string) => Promise<{ entry: CatalogEntry }>,
  enrich: (request: EnrichRequest) => Promise<GameEnrichment | undefined>,
) => async (apworld: string): Promise<WorldInfo> => {
  try {
    const { entry } = await indexEntry(apworld);
    const found = await enrich({ apworld, source: entry.source });
    return { home: entry.home, texts: [entry.setupGuide, entry.tracker, found?.markdown] };
  } catch {
    return { texts: [] };
  }
};

export { createWorldInfo };
