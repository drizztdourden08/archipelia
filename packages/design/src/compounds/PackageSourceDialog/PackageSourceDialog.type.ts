/* @layer renderer-app @kind types */
import type { SourceBuildMissing, SourceBuildPlan, SourceCandidate, SourcePlan, SourceSuggestions, SourceToolPlan } from '@archipelia/model';

type BuildStage =
  | { kind: 'confirm' }
  | { kind: 'preparing' }
  | { kind: 'ready'; build: SourceBuildPlan }
  | { kind: 'building'; build: SourceBuildPlan }
  | { kind: 'missing'; build: SourceBuildPlan; missing: SourceBuildMissing; log: readonly string[]; tool?: SourceToolPlan | undefined }
  | { kind: 'installing'; build: SourceBuildPlan; tool: SourceToolPlan }
  | { kind: 'paused'; build: SourceBuildPlan; message: string; log: readonly string[] }
  | { kind: 'failed'; build: SourceBuildPlan | undefined; message: string; log: readonly string[] };

type BuildLogView = { lines: readonly string[]; label: string | undefined; progress: number };

type PackageSourceStep =
  | { kind: 'searching' }
  | { kind: 'results'; suggestions: SourceSuggestions; looking: boolean }
  | { kind: 'trust'; candidate: SourceCandidate }
  | { kind: 'planning'; candidate: SourceCandidate }
  | { kind: 'plan'; candidate: SourceCandidate; plan: SourcePlan; checking: boolean; stillMissing: boolean; installing: boolean }
  | { kind: 'build'; candidate: SourceCandidate; plan: SourcePlan; stage: BuildStage }
  | { kind: 'failed'; message: string };

type PackageSourceHandlers = {
  onPaste: (text: string) => void;
  onPick: (candidate: SourceCandidate) => void;
  onTrust: () => void;
  onBack: () => void;
  onRetry: () => void;
  onInstallFromPypi: () => void;
  onUseWheel: (typed: string) => void;
  onCheckAgain: () => void;
  onBuild: () => void;
  onBuildDownload: () => void;
  onBuildStart: (build: SourceBuildPlan) => void;
  onBuildCancel: () => void;
  onToolInstall: (build: SourceBuildPlan, tool: SourceToolPlan) => void;
  onToolCancel: () => void;
  onOpenLink: (url: string) => void;
  onClose: () => void;
};

type PackageSourceDialogProps = PackageSourceHandlers & {
  title: string;
  module: string;
  step: PackageSourceStep;
  buildLog?: BuildLogView | undefined;
};

type CandidateListProps = Pick<PackageSourceHandlers, 'onPaste' | 'onPick' | 'onOpenLink'> & {
  module: string;
  suggestions: SourceSuggestions;
  looking: boolean;
};

type CandidateCardProps = Pick<PackageSourceHandlers, 'onPick' | 'onOpenLink'> & {
  module: string;
  candidate: SourceCandidate;
};

type PasteFieldProps = Pick<PackageSourceHandlers, 'onPaste'> & { failed: boolean; looking: boolean };

type TrustStepProps = Pick<PackageSourceHandlers, 'onTrust'> & { module: string; candidate: SourceCandidate };

type PlanStepProps = Pick<PackageSourceHandlers, 'onInstallFromPypi' | 'onUseWheel' | 'onCheckAgain' | 'onBuild'> & {
  module: string;
  plan: SourcePlan;
  checking: boolean;
  stillMissing: boolean;
  installing: boolean;
};

type WheelOfferProps = Pick<PackageSourceHandlers, 'onUseWheel'> & { plan: SourcePlan; installing: boolean };

type ManualStepsProps = Pick<PackageSourceHandlers, 'onCheckAgain'> & {
  module: string;
  plan: SourcePlan;
  checking: boolean;
  stillMissing: boolean;
};

type BuildStepProps = Pick<PackageSourceHandlers, 'onBuildCancel' | 'onBuildDownload' | 'onBuildStart' | 'onOpenLink' | 'onToolCancel' | 'onToolInstall'> & {
  module: string;
  candidate: SourceCandidate;
  plan: SourcePlan;
  stage: BuildStage;
  buildLog: BuildLogView | undefined;
};

type BuildLogProps = { lines: readonly string[]; label: string | undefined };

type BuildMissingProps = Pick<PackageSourceHandlers, 'onBuildStart' | 'onOpenLink' | 'onToolInstall'> & {
  build: SourceBuildPlan;
  missing: SourceBuildMissing;
  log: readonly string[];
  tool: SourceToolPlan | undefined;
};

type ToolWay = 'how' | 'install' | null;

type ToolChoiceProps = Pick<PackageSourceHandlers, 'onToolInstall' | 'onOpenLink'> & { build: SourceBuildPlan; tool: SourceToolPlan };

type ToolHowProps = { how: string; blocked: SourceToolPlan['blocked'] };

type ToolInstallProps = Pick<PackageSourceHandlers, 'onToolInstall' | 'onOpenLink'> & { build: SourceBuildPlan; tool: SourceToolPlan };

type BuildInstallingProps = Pick<PackageSourceHandlers, 'onToolCancel'> & { tool: SourceToolPlan; buildLog: BuildLogView | undefined };

type BuildPausedProps = Pick<PackageSourceHandlers, 'onBuildStart'> & { build: SourceBuildPlan; message: string; log: readonly string[] };

type BuildConfirmProps = Pick<PackageSourceHandlers, 'onBuildDownload'> & { repo: string; short: string };

type BuildRunningProps = { text: string; buildLog: BuildLogView | undefined; onCancel: (() => void) | undefined };

type BuildFailedProps = Pick<PackageSourceHandlers, 'onBuildStart'> & { build: SourceBuildPlan | undefined; message: string; log: readonly string[] };

type BuildReadyProps = Pick<PackageSourceHandlers, 'onBuildStart'> & { module: string; candidate: SourceCandidate; build: SourceBuildPlan };

export type {
  BuildConfirmProps, BuildFailedProps, BuildInstallingProps, BuildLogProps, BuildLogView, BuildMissingProps, BuildPausedProps, BuildRunningProps, BuildReadyProps, BuildStage, BuildStepProps, CandidateCardProps, CandidateListProps, ManualStepsProps,
  PackageSourceDialogProps, PackageSourceStep, PasteFieldProps, PlanStepProps, ToolChoiceProps, ToolHowProps, ToolInstallProps, ToolWay, TrustStepProps, WheelOfferProps,
};
