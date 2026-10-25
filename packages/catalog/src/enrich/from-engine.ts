/* @layer core @kind logic */
import type { EnrichPlan, EnrichRecord } from './enrich.type';
import { RECORD_VERSION } from './enrich.constants';
import { blocksOf } from './blocks-of';
import { introOf } from './intro-of';
import { readWorldDocs } from './read-world-docs';

const fromEngine = async (engineDir: string, apworld: string, { entry, stamp }: EnrichPlan, now: number): Promise<EnrichRecord> => {
  const text = await readWorldDocs({ engineDir, apworld, game: entry.game, ...(entry.file ? { file: entry.file } : {}) });
  return { version: RECORD_VERSION, stamp, fetchedAt: now, ...introOf(blocksOf(text ?? '')) };
};

export { fromEngine };
