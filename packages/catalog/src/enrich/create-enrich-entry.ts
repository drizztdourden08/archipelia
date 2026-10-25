/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { readOfficialIndex } from '../official/read-official-index';
import type { EnrichEntry, EnrichRequest } from './enrich.type';

const createEnrichEntry = (engineDir: () => Promise<string>, entries: () => CatalogEntry[]) =>
  async ({ apworld, source }: EnrichRequest): Promise<EnrichEntry | undefined> => {
    if (source === 'official') {
      const world = (await readOfficialIndex(await engineDir())).find((candidate) => candidate.apworld === apworld);
      return world && { game: world.game, file: world.file };
    }
    const entry = entries().find((candidate) => candidate.apworld === apworld && candidate.source === source);
    return entry && { game: entry.game, ...(entry.home ? { home: entry.home } : {}) };
  };

export { createEnrichEntry };
