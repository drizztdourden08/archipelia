/* @layer core @kind types */
import type { DataFiles, InstalledGame } from '@archipelia/model';
import type { FirstPartyRead } from '../first-party/first-party.type';

type ReinstallEntryParams = {
  read: FirstPartyRead;
  before: InstalledGame | null;
  cache: DataFiles;
  apworld: string;
  request: typeof fetch;
};

export type { ReinstallEntryParams };
