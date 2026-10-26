/* @layer core @kind types */
import type { EngineRuntime, SourceBuildJob, SourcePlan } from '@archipelia/model';
import type { ZipEntry } from '@archipelia/model/zip';
import type { BuildDirs, ResolvedPackage } from '@archipelia/engine';
import type { Fetch } from '../install/fetch-file.type';

type Archive = { file: string; sha256: string; size: number };

type ArchiveSite = { owner: string; repo: string; sha: string };

type ArchiveLimits = { dir: string; signal: AbortSignal };

type ArchiveEntry = { entry: ZipEntry; parts: string[]; folder: boolean };

type BuildRun = { status: 'done' | 'failed' | 'cancelled' | 'rejected'; code: number | null; lines: string[]; error?: string | undefined };

type BuildRunner = (job: SourceBuildJob, buildId: string) => Promise<BuildRun>;

type BuildDeps = {
  fetch: Fetch;
  engineDir: () => Promise<string>;
  run?: BuildRunner | undefined;
  log?: ((message: string) => void) | undefined;
};

type BuildPhase = 'preparing' | 'ready' | 'building';

type ActiveBuild = {
  id: string;
  plan: SourcePlan;
  runtime: EngineRuntime;
  dirs: BuildDirs;
  controller: AbortController;
  phase: BuildPhase;
  archive?: Archive;
  pins: ResolvedPackage[];
};

type BuildSession = {
  current: () => ActiveBuild | undefined;
  open: (build: ActiveBuild) => void;
  close: () => Promise<void>;
};

export type { ActiveBuild, Archive, ArchiveEntry, ArchiveLimits, ArchiveSite, BuildDeps, BuildPhase, BuildRun, BuildRunner, BuildSession };
