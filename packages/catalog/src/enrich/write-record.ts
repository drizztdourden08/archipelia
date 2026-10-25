/* @layer core @kind logic */
import type { DataFiles } from '@archipelia/model';
import type { EnrichRecord } from './enrich.type';
import { recordPath } from './record-path';

const writeRecord = (cache: DataFiles, apworld: string, record: EnrichRecord): Promise<void> => cache.writeJson(recordPath(apworld), record);

export { writeRecord };
