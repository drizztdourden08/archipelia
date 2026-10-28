/* @layer core @kind types */
import type { DataFiles, InstalledGame } from '@archipelia/model';
import type { TrustDeps } from '../first-party/vet-release.type';

type ReinstallFirstPartyParams = {
  engineDir: string;
  files: DataFiles;
  cache: DataFiles;
  apworld: string;
  fetch?: typeof fetch;
  trustRoot?: TrustDeps['root'];
};

type Reinstalled = { game: InstalledGame; note?: string };

export type { Reinstalled, ReinstallFirstPartyParams };
