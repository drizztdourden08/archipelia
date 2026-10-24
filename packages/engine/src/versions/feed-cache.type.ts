/* @layer core @kind types */
import type { ApRelease, PythonBuild, PythonRange } from '@archipelia/model';

type FeedCache = {
  version: 1;
  fetchedAt: number;
  target: string;
  etag?: string;
  releases: ApRelease[];
  pythonRelease: string;
  python: PythonBuild[];
  ranges: Record<string, PythonRange>;
};

type FeedStore = {
  read: () => Promise<FeedCache | undefined>;
  write: (cache: FeedCache) => Promise<void>;
};

export type { FeedCache, FeedStore };
