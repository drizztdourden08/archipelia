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

type EnrichEntry = { game: string; file?: string; home?: string };

type EnrichDeps = {
  cache: DataFiles;
  engineDir: () => Promise<string>;
  entryOf: (request: EnrichRequest) => Promise<EnrichEntry | undefined>;
  fetch?: typeof fetch;
  now?: () => number;
};

type EnrichPlan = { entry: EnrichEntry; stamp: string; repo?: GithubRepo };

type GithubParams = { fetch: typeof fetch; repo: GithubRepo; stamp: string; old: EnrichRecord | undefined; now: number };

type GithubRepo = { owner: string; repo: string };

type ReadmeRead =
  | { kind: 'text'; text: string; etag?: string; url: string }
  | { kind: 'same' }
  | { kind: 'missing' };

type ReadmeParams = { fetch: typeof fetch; repo: GithubRepo; etag?: string | undefined; url?: string | undefined };

type DocsParams = { engineDir: string; apworld: string; game: string; file?: string };

export type { DocsParams, EnrichDeps, EnrichEntry, EnrichPlan, EnrichRecord, EnrichRequest, GameEnrichment, GithubParams, GithubRepo, ReadmeParams, ReadmeRead };
