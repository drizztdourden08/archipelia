/* @layer core @kind types */
import type { DataFiles } from '@archipelia/model';
import type { TrustedRoot } from '@sigstore/protobuf-specs';

type TrustedRootSource = 'tuf' | 'cache';

type TrustedRootLoad = { root: TrustedRoot; source: TrustedRootSource; refreshedAt: number; problems: string[] };

type FetchTrustedRoot = (cachePath: string) => Promise<TrustedRoot>;

type LoadTrustedRootDeps = {
  files: DataFiles;
  fetchRoot?: FetchTrustedRoot;
  now?: () => number;
};

type LoadTrustedRootOptions = { force?: boolean };

export type { FetchTrustedRoot, LoadTrustedRootDeps, LoadTrustedRootOptions, TrustedRootLoad, TrustedRootSource };
