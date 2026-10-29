/* @layer core @kind types */
import type { DataFiles, GameSource } from '@archipelia/model';

type EnrichRequest = { apworld: string; source: GameSource };

type GameEnrichment = {
  apworld: string;
  markdown?: string;
  art?: string;
  origin: 'engine' | 'github';
};

type EnrichRecord = {
  version: number;
  stamp: string;
  fetchedAt: number;
  markdown?: string;
  art?: string;
  etag?: string;
  readmeUrl?: string;
};

type EnrichEntry = { game: string; file?: string; home?: string; release?: GithubRepo; releaseVersion?: string; releaseTag?: string };

type EnrichDeps = {
  cache: DataFiles;
  engineDir: () => Promise<string>;
  entryOf: (request: EnrichRequest) => Promise<EnrichEntry | undefined>;
  fetch?: typeof fetch;
  now?: () => number;
};

type EnrichPlan = { entry: EnrichEntry; stamp: string; repo?: GithubRepo; release?: GithubRepo; tag?: string };

type GithubParams = { fetch: typeof fetch; repo: GithubRepo; release?: GithubRepo | undefined; tag?: string | undefined; stamp: string; old: EnrichRecord | undefined; now: number };

type ImageInfo = { type: 'image/png' | 'image/webp'; width: number; height: number; animated: boolean };

type ImageSize = Pick<ImageInfo, 'width' | 'height'>;

type ReleaseFiles = { markdown?: string; art?: string };

type GithubRepo = { owner: string; repo: string };

type ReadmeRead =
  | { kind: 'text'; text: string; etag?: string; url: string }
  | { kind: 'same' }
  | { kind: 'missing' };

type ReadmeParams = { fetch: typeof fetch; repo: GithubRepo; etag?: string | undefined; url?: string | undefined };

type DocsParams = { engineDir: string; apworld: string; game: string; file?: string };

export type {
  DocsParams, EnrichDeps, EnrichEntry, EnrichPlan, EnrichRecord, EnrichRequest, GameEnrichment, GithubParams, GithubRepo, ImageInfo, ImageSize, ReadmeParams, ReadmeRead, ReleaseFiles,
};
