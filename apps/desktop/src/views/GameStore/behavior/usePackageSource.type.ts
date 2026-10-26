/* @layer renderer-app @kind types */
import type { ConsentPackage, PackageSourceDialogProps, PackageSourceStep } from '@archipelia/design';
import type { InstallRequest } from '@archipelia/catalog';
import type { InstallFailure, SourceCandidate, SourceSuggestions } from '@archipelia/model';

type SourceAim = { key: string; title: string; module: string; linked?: string | undefined; request?: InstallRequest | undefined };

type SetStep = (step: PackageSourceStep) => void;

type PlanState = Extract<PackageSourceStep, { kind: 'plan' }>;

type SearchRun = { aim: SourceAim; setStep: SetStep; setResults: (found: SourceSuggestions) => void; paste?: string; showing?: SourceSuggestions | null };

type PlanRun = { aim: SourceAim; candidate: SourceCandidate; setStep: SetStep };

type InstallWorld = (request: InstallRequest, key: string) => Promise<boolean | undefined>;

type CheckRun = { aim: SourceAim; state: PlanState; install: InstallWorld; setStep: SetStep; close: () => void };

type PypiRun = { aim: SourceAim; state: PlanState; ask: (title: string, packages: readonly ConsentPackage[]) => Promise<boolean>; setStep: SetStep };

type SourceHandlers = Omit<PackageSourceDialogProps, 'title' | 'module' | 'step'>;

type SourceHandlersRun = Pick<PypiRun, 'aim' | 'ask' | 'setStep'> & {
  step: PackageSourceStep;
  results: SourceSuggestions | null;
  installWorld: InstallWorld;
  setResults: (found: SourceSuggestions) => void;
  close: () => void;
};

type PackageSourceParams = {
  needOf: (key: string) => InstallFailure | undefined;
  installWorld: InstallWorld;
  ask: PypiRun['ask'];
};

export type { CheckRun, PackageSourceParams, PlanRun, PypiRun, SearchRun, SourceAim, SourceHandlers, SourceHandlersRun };
