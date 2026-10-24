/* @layer core @kind types */
import type { JobHandle } from '@drizztdourden08/brock-core/jobs';
import type { EngineSpec } from '../index';
import type { CarryResult, EngineChoice, EngineRuntime, InstalledEngine, RecordGuard, SmokeResult } from '@archipelia/model';
import type { SmokeInput, SmokeOutcome } from './smoke/smoke.type';

type EngineJob = Pick<JobHandle, 'signal' | 'step' | 'log' | 'skip' | 'done' | 'fail'>;

type ResolvedChoice = { spec: EngineSpec; warnings: string[] };

type BuildHooks = {
  onLine: (line: string) => void;
  onStep: (step: string, line: string) => void;
  onSkip: (step: string) => void;
  signal: AbortSignal;
};

type CarryPass = { from: EngineRuntime; to: EngineRuntime; since: number };

type SwitchRequest = { id: string; from?: EngineRuntime; since: number; guard?: RecordGuard };

type SwitchDeps = {
  runtimeOf: (id: string) => Promise<EngineRuntime>;
  guardRecords: () => Promise<RecordGuard>;
  carry: (pass: CarryPass) => Promise<CarryResult>;
  activate: (id: string) => Promise<void>;
};

type InstallDeps = SwitchDeps & {
  job: () => EngineJob;
  resolve: (choice: EngineChoice, signal: AbortSignal) => Promise<ResolvedChoice>;
  wasBuilt: (id: string) => Promise<boolean>;
  build: (spec: EngineSpec, hooks: BuildHooks) => Promise<void>;
  active: () => Promise<EngineRuntime | undefined>;
  smoke: (input: SmokeInput) => Promise<SmokeOutcome>;
  stamp: (id: string, smoke: SmokeResult) => Promise<void>;
  describe: (id: string) => Promise<InstalledEngine>;
  register: (engine: InstalledEngine) => Promise<void>;
  discard: (id: string) => Promise<void>;
  fallback: (choice: EngineChoice) => Promise<EngineChoice | undefined>;
};

type InstallProgress = { id?: string; existed: boolean; kept: boolean; guard?: RecordGuard };

type InstallRun = { deps: InstallDeps; choice: EngineChoice; job: EngineJob; progress: InstallProgress };

type BuiltEngine = { spec: EngineSpec; target: EngineRuntime; from?: EngineRuntime; isActive: boolean };

export type {
  BuiltEngine, EngineJob, InstallDeps, InstallProgress, InstallRun, ResolvedChoice, SwitchDeps, SwitchRequest,
};
