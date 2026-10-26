/* @layer renderer-app @kind types */
import type { SourceCandidate, SourcePlan, SourceSuggestions } from '@archipelia/model';

type PackageSourceStep =
  | { kind: 'searching' }
  | { kind: 'results'; suggestions: SourceSuggestions; looking: boolean }
  | { kind: 'trust'; candidate: SourceCandidate }
  | { kind: 'planning'; candidate: SourceCandidate }
  | { kind: 'plan'; candidate: SourceCandidate; plan: SourcePlan; checking: boolean; stillMissing: boolean; installing: boolean }
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
  onOpenLink: (url: string) => void;
  onClose: () => void;
};

type PackageSourceDialogProps = PackageSourceHandlers & {
  title: string;
  module: string;
  step: PackageSourceStep;
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

type PlanStepProps = Pick<PackageSourceHandlers, 'onInstallFromPypi' | 'onUseWheel' | 'onCheckAgain'> & {
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

export type {
  CandidateCardProps, CandidateListProps, ManualStepsProps, PackageSourceDialogProps, PackageSourceStep, PasteFieldProps, PlanStepProps,
  TrustStepProps, WheelOfferProps,
};
