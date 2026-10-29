/* @layer core @kind types */
import type { DataFiles, InstalledGame } from '@archipelia/model';
import type { FirstPartyRead } from '../first-party/first-party.type';
import type { ReleasesRead } from '../versions/versions.type';

type ReinstallEntryParams = {
  read: FirstPartyRead;
  before: InstalledGame | null;
  cache: DataFiles;
  apworld: string;
  request: typeof fetch;
  readReleases: (repo: string) => Promise<ReleasesRead>;
};

export type { ReinstallEntryParams };
