/* @layer renderer-app @kind types */
import type { WizardApi } from '@drizztdourden08/tessera/composites';
import type { SourceBuildMissing, SourceBuildPlan, SourceCandidate, SourcePlan, SourceSuggestions, SourceToolPlan } from '@archipelia/model';
import type { ConsentPackage, ConsentWheel } from '../PackageConsentDialog';

type BuildStage =
  | { kind: 'preparing' }
  | { kind: 'ready'; build: SourceBuildPlan }
  | { kind: 'building'; build: SourceBuildPlan }
  | { kind: 'built'; build: SourceBuildPlan }
  | { kind: 'missing'; build: SourceBuildPlan; missing: SourceBuildMissing; log: readonly string[]; tool?: SourceToolPlan | undefined }
  | { kind: 'installing'; build: SourceBuildPlan; tool: SourceToolPlan }
  | { kind: 'paused'; build: SourceBuildPlan; message: string; log: readonly string[] }
  | { kind: 'failed'; build: SourceBuildPlan | undefined; message: string; log: readonly string[] };

type BuildLogView = { lines: readonly string[]; label: string | undefined; progress: number };

type SourceSearch = { suggestions: SourceSuggestions | null; looking: boolean; failed: string | undefined };

type PackageSourceStep =
  | { kind: 'idle' }
  | { kind: 'planning'; candidate: SourceCandidate }
  | { kind: 'planFailed'; candidate: SourceCandidate; message: string }
  | { kind: 'plan'; candidate: SourceCandidate; plan: SourcePlan }
  | { kind: 'build'; candidate: SourceCandidate; plan: SourcePlan; stage: BuildStage };

type SourceFinish =
  | { kind: 'idle' }
  | { kind: 'running' }
  | { kind: 'done' }
  | { kind: 'missing'; names: readonly string[] }
  | { kind: 'failed'; message: string };

type SourceConsent = { packages: readonly ConsentPackage[]; wheels: readonly ConsentWheel[] };

type PackageSourceHandlers = {
  onPaste: (text: string) => void;
  onRetrySearch: () => void;
  onPlan: (candidate: SourceCandidate) => void;
  onInstallFromPypi: () => void;
  onUseWheel: (typed: string) => void;
  onCheckAgain: () => void;
  onBuildDownload: () => void;
  onBuildStart: (build: SourceBuildPlan) => void;
  onBuildCancel: () => void;
  onToolInstall: (build: SourceBuildPlan, tool: SourceToolPlan) => void;
  onToolCancel: () => void;
  onConsent: (accepted: boolean) => void;
  onOpenLink: (url: string) => void;
  onClose: () => void;
};

type PackageSourceDialogProps = PackageSourceHandlers & {
  title: string;
  module: string;
  search: SourceSearch;
  step: PackageSourceStep;
  finish: SourceFinish;
  consent: SourceConsent | null;
  buildLog?: BuildLogView | undefined;
};

type SourceRoute = 'wheel' | 'pypi' | 'source';

type SourceHow = 'build' | 'myself';

type SourceValues = {
  pick: string;
  trusted: boolean;
  typed: string;
  route: SourceRoute | '';
  wheelTyped: string;
  how: SourceHow | '';
  tooled: boolean;
};

type SourceView = {
  candidate: SourceCandidate | undefined;
  plan: SourcePlan | undefined;
  stage: BuildStage | undefined;
  route: SourceRoute | '';
  asking: boolean;
  running: boolean;
};

type StepBodyProps = { dialog: PackageSourceDialogProps; wizard: WizardApi<SourceValues>; view: SourceView };

export type {
  BuildLogView, BuildStage, PackageSourceDialogProps, PackageSourceHandlers, PackageSourceStep, SourceConsent, SourceFinish, SourceHow, SourceRoute, SourceSearch, SourceValues,
  SourceView, StepBodyProps,
};
