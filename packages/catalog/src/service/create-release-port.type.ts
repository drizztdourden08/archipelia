/* @layer core @kind types */
import type { CatalogEntry, DataFiles } from '@archipelia/model';
import type { ReleasesRead } from '../versions/versions.type';
import type { Latest } from './catalog-service.type';

type ReleasePortDeps = {
  cache: DataFiles;
  fetch?: typeof fetch;
  readReleases: (repo: string) => Promise<ReleasesRead>;
  activeAp: () => Promise<string | undefined>;
  indexEntry: (apworld: string) => Promise<{ entry: CatalogEntry; latest: Latest }>;
};

export type { ReleasePortDeps };
