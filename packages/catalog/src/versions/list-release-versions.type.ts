/* @layer core @kind types */
import type { DataFiles } from '@archipelia/model';
import type { ReleasesRead } from './versions.type';

type ReleaseListDeps = { files: DataFiles; request: typeof fetch; readReleases: (repo: string) => Promise<ReleasesRead> };

export type { ReleaseListDeps };
