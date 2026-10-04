/* @layer core @kind logic */
import type { DataFiles, InstalledGame } from '@archipelia/model';
import { recordPath } from './record-path';

const readInstalled = (files: DataFiles, apworld: string) =>
  files.readJson<InstalledGame | null>(recordPath(apworld), null).catch(() => null);

export { readInstalled };
