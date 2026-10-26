/* @layer core @kind types */
import type { SourceCandidate, SourceOrigin } from '@archipelia/model';
import type { GithubRepo } from '../enrich/enrich.type';

type RepoFacts = {
  owner: string;
  repo: string;
  description: string | undefined;
  stars: number;
  pushedAt: string | undefined;
  createdAt: string | undefined;
  archived: boolean;
  fork: boolean;
  branch: string | undefined;
};

type GithubClient = {
  api: (path: string) => Promise<unknown>;
  raw: (repo: GithubRepo, rev: string, file: string) => Promise<string | undefined>;
};

type CacheEntry<T> = { at: number; value: Promise<T> };

type GithubClientDeps = { fetch?: typeof fetch; now?: () => number };

type WorldContext = { links: GithubRepo[]; author?: string | undefined; named?: GithubRepo | undefined };

type WorldTexts = { linked?: string | undefined; home?: string | undefined; texts: (string | undefined)[] };

type WorldInfo = Omit<WorldTexts, 'linked'>;

type SourceServiceDeps = { fetch?: typeof fetch; engineDir: () => Promise<string>; worldOf: (apworld: string) => Promise<WorldInfo> };

type Wanted ={ module: string; world: WorldContext; paste?: string | undefined };

type Found = { facts: RepoFacts; origins: SourceOrigin[] };

type Attempt = { found: Found[]; limitedUntil?: number; error?: unknown };

type SuggestDeps ={ client: GithubClient; now: () => number };

type PlanDeps = { client: GithubClient; fetch: typeof fetch; engineDir: () => Promise<string> };

type TagFact = { name: string; sha: string };

type SetupFiles = { pyproject?: string | undefined; setupCfg?: string | undefined; setupPy?: string | undefined };

type CommitFacts = { sha: string; date: string | undefined };

type TreeFacts = { native: boolean; submodules: boolean; unsure: boolean };

type Ranked = Pick<SourceCandidate, 'repo' | 'contains' | 'origins' | 'fork' | 'stars' | 'pushedAt'>;

export type {
  Attempt, CacheEntry, CommitFacts, Found, GithubClient, GithubClientDeps, PlanDeps, Ranked, RepoFacts, SetupFiles, SourceServiceDeps, SuggestDeps, TagFact, TreeFacts, Wanted, WorldContext, WorldInfo, WorldTexts,
};
