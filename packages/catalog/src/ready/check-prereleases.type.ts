/* @layer core @kind types */
import type { ReleasesRead } from '../versions/versions.type';
import type { ReadyRepo } from './ready.type';

type PrereleaseParams = { repos: ReadyRepo[]; request: typeof fetch; readReleases: (repo: string) => Promise<ReleasesRead> };

export type { PrereleaseParams };
