/* @layer core @kind types */

type SourceOrigin = 'world' | 'author' | 'search' | 'pasted';

type SourceWarning = 'archived' | 'new' | 'few-stars' | 'fork';

type SourceRef = { owner: string; repo: string; module: string };

type SourcePypiInstall = SourceRef & { packages: string[] };

type SuggestRequest ={ apworld: string; module: string; linked?: string | undefined; paste?: string | undefined };

type SourceCandidate = {
  id: string;
  owner: string;
  repo: string;
  url: string;
  description?: string | undefined;
  stars: number;
  pushedAt?: string | undefined;
  createdAt?: string | undefined;
  archived: boolean;
  fork: boolean;
  origins: SourceOrigin[];
  contains: boolean;
  warnings: SourceWarning[];
};

type SourceSuggestions = { module: string; candidates: SourceCandidate[]; limitedUntil?: number | undefined; pasteFailed?: boolean | undefined };

type SourcePin = { kind: 'tag' | 'head'; ref: string; sha: string; date?: string | undefined };

type SourcePypi = { name: string; version: string; linked: boolean };

type SourcePlan = {
  owner: string;
  repo: string;
  url: string;
  module: string;
  pin: SourcePin;
  python: string;
  command: string;
  native: boolean;
  submodules: boolean;
  unsure: boolean;
  projectName?: string | undefined;
  pypi?: SourcePypi | undefined;
};

export type { SourceCandidate, SourceOrigin, SourcePin, SourcePlan, SourcePypi, SourcePypiInstall, SourceRef, SourceSuggestions, SourceWarning, SuggestRequest };
