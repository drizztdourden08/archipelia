/* @layer renderer-app @kind types */
import type { PackageSourceDialogProps, PackageSourceStep, SourceSearch } from '@archipelia/design';
import type { InstallRequest } from '@archipelia/catalog';
import type { InstallFailure, SourceBuildMissing, SourceBuildPlan, SourceCandidate, SourceToolEnd, SourceToolPlan } from '@archipelia/model';
import type { UseConsent } from './useConsent.type';

type SourceAim = { key: string; title: string; module: string; linked?: string | undefined; request?: InstallRequest | undefined };

type SetStep = (step: PackageSourceStep) => void;

type PlanState = Extract<PackageSourceStep, { kind: 'plan' }>;

type BuildState = Extract<PackageSourceStep, { kind: 'build' }>;

type FinishState = { kind: 'idle' } | { kind: 'running' } | { kind: 'done' } | { kind: 'failed'; message?: string | undefined };

type SetFinish = (finish: FinishState) => void;

type InstallWorld = (request: InstallRequest, key: string) => Promise<boolean | undefined>;

type Finishing = (sentence: string, work: () => Promise<boolean | undefined>) => Promise<boolean | undefined>;

type SearchRun = { aim: SourceAim; search: SourceSearch; setSearch: (search: SourceSearch) => void; paste?: string };

type PlanRun = { aim: SourceAim; candidate: SourceCandidate; setStep: SetStep };

type CheckRun = { aim: SourceAim; install: InstallWorld; finishing: Finishing };

type PypiRun = { aim: SourceAim; state: PlanState | BuildState; ask: UseConsent['ask']; install: InstallWorld; finishing: Finishing };

type WheelRun = { aim: SourceAim; state: PlanState | BuildState; typed: string; install: InstallWorld; finishing: Finishing };

type BuildPrepareRun = { aim: SourceAim; state: PlanState | BuildState; setStep: SetStep };

type BuildStartRun = { aim: SourceAim; state: BuildState; build: SourceBuildPlan; install: InstallWorld; finishing: Finishing; setStep: SetStep };

type ToolInstallRun = BuildStartRun & { missing: SourceBuildMissing; log: readonly string[]; tool: SourceToolPlan };

type ToolEndRun = { run: ToolInstallRun; end: SourceToolEnd };

type SourceHandlers = Omit<PackageSourceDialogProps, 'title' | 'module' | 'search' | 'step' | 'finish' | 'consent' | 'buildLog'>;

type SourceHandlersRun = {
  aim: SourceAim;
  step: PackageSourceStep;
  search: SourceSearch;
  consent: UseConsent;
  installWorld: InstallWorld;
  setStep: SetStep;
  setSearch: (search: SourceSearch) => void;
  setFinish: SetFinish;
  close: () => void;
};

type PackageSourceParams = {
  needOf: (key: string) => InstallFailure | undefined;
  errorOf: (key: string) => string | null;
  installWorld: InstallWorld;
  consent: UseConsent;
};

export type {
  BuildPrepareRun, BuildStartRun, CheckRun, FinishState, Finishing, PackageSourceParams, PlanRun, PypiRun, SearchRun, SetFinish, SourceAim,
  SourceHandlers, SourceHandlersRun, ToolEndRun, ToolInstallRun, WheelRun,
};
