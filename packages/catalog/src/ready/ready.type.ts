/* @layer core @kind types */
import type { DataFiles } from '@archipelia/model';
import type { ReleasesRead } from '../versions/versions.type';

type ReadyRepo = {
  id: number;
  fullName: string;
  owner: string;
  stars: number;
  pushedAt: string;
  createdAt: string;
  direct: boolean;
};

type ReadyCache = { fetchedAt: number; etag?: string; total: number; fetched: number; repos: ReadyRepo[] };

type ReadySearch = {
  repos: ReadyRepo[];
  total: number;
  fetched: number;
  fetchedAt: number;
  problems: string[];
  limitedUntil?: number;
};

type ReadyPage = { items: unknown[]; total: number; next?: string; etag?: string };

type ReadyFound = { kind: 'found'; repos: ReadyRepo[]; total: number; fetched: number; etag?: string };

type ReadyResult = ReadyFound | { kind: 'same' };

type ReadySearchDeps = { files: DataFiles; fetch?: typeof fetch; now?: () => number; readReleases?: (repo: string) => Promise<ReleasesRead> };

export type { ReadyCache, ReadyPage, ReadyRepo, ReadyResult, ReadySearch, ReadySearchDeps };
