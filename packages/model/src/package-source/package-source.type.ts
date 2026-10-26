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

type SourceWheelFit = 'exact' | 'abi3' | 'pure';

type SourceWheel = { tag: string; asset: string; size: number; digest: string | undefined; fit: SourceWheelFit };

type SourceWheelState = 'found' | 'none' | 'unknown';

type SourceWheelRequest = SourceRef & { tag: string; asset: string; typed?: string | undefined };

type PackageSource = { repo: string; tag: string; asset: string; sha256: string; verified: boolean; name: string; version: string };

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
  wheel?: SourceWheel | undefined;
  wheelState: SourceWheelState;
};

export type {
  PackageSource, SourceCandidate, SourceOrigin, SourcePin, SourcePlan, SourcePypi, SourcePypiInstall, SourceRef, SourceSuggestions, SourceWarning, SourceWheel,
  SourceWheelFit, SourceWheelRequest, SourceWheelState, SuggestRequest,
};
