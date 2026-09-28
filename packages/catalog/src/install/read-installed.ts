/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { readJson } from '@drizztdourden08/brock-core/storage';
import type { InstalledGame } from '@archipelia/model';
import { recordPath } from './record-path';

const readInstalled = (files: FileStore, apworld: string) => readJson<InstalledGame | null>(files, recordPath(apworld), null);

export { readInstalled };
