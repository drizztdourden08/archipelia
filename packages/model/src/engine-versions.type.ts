/* @layer core @kind types */
import type { EngineStatus } from './engine.type';

type ApRelease = { version: string; tag: string; publishedAt: string; notesUrl: string };

type PythonBuild = { version: string; release: string; target: string; file: string; sha256: string; pinned?: boolean };

type PythonRange = { min: string; maxExclusive?: string; warnBelow?: string; source: 'declared' | 'defaults' | 'unknown' };

type RequirementRule = { ap?: string; python?: string; skip: string[]; extra: string[] };

type EngineChoice = { ap: string; python: string; pythonRelease: string };

type SmokeResult = { ok: boolean; at: number; failed?: 'schema' | 'generate' | 'host'; warnings: string[] };

type InstalledEngine = {
  id: string;
  ap: string;
  apCommit: string;
  python: string;
  pythonRelease: string;
  target: string;
  builtAt: number;
  state: 'ready' | 'failed';
  smoke?: SmokeResult;
};

type EngineStateFile = { version: 1; active?: string; lastGood?: string; installed: InstalledEngine[]; offeredAp?: string };

type FeedState = 'fresh' | 'cached' | 'offline' | 'rate-limited' | 'never';

type VersionTag = 'new-version' | 'up-to-date' | 'not-checked';

type VersionFeed = {
  state: FeedState;
  checkedAt?: number;
  retryAt?: number;
  releases: ApRelease[];
  python: PythonBuild[];
  error?: string;
};

type EngineOverview = {
  status: EngineStatus;
  active?: InstalledEngine;
  installed: InstalledEngine[];
  feed: VersionFeed;
  tag: VersionTag;
  latestAp?: string;
};

type StartupDecision =
  | { kind: 'first-run'; choice: EngineChoice }
  | { kind: 'offer'; from: string; to: string; notesUrl: string }
  | { kind: 'none' };

type EngineInstallResult = {
  outcome: 'switched' | 'ready' | 'failed' | 'cancelled';
  id?: string;
  failed?: SmokeResult['failed'];
  brokenWorlds?: string[];
  error?: string;
};

type EngineEvent = {
  kind: 'installed' | 'switched' | 'removed' | 'failed';
  id: string;
  overview: EngineOverview;
};

export type {
  ApRelease, EngineChoice, EngineEvent, EngineInstallResult, EngineOverview, EngineStateFile, FeedState, InstalledEngine,
  PythonBuild, PythonRange, RequirementRule, SmokeResult, StartupDecision, VersionFeed, VersionTag,
};
