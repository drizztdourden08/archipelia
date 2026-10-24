/* @layer core @kind types */
import type { DataFiles } from '@archipelia/model';
import type { TrustDeps } from '../first-party/vet-release.type';

type ReinstallFirstPartyParams = {
  engineDir: string;
  files: DataFiles;
  cache: DataFiles;
  apworld: string;
  fetch?: typeof fetch;
  trustRoot?: TrustDeps['root'];
};

export type { ReinstallFirstPartyParams };
