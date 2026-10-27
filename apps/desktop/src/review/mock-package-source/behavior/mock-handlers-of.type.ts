/* @layer renderer-app @kind types */
import type { RefObject } from 'react';
import type { BuildLogView, PackageSourceStep, SourceConsent, SourceFinish } from '@archipelia/design';

type BuildStep = Extract<PackageSourceStep, { kind: 'build' }>;

type MockWorld = {
  setStep: (step: PackageSourceStep) => void;
  setFinish: (finish: SourceFinish) => void;
  setConsent: (consent: SourceConsent | null) => void;
  setBuildLog: (log: BuildLogView) => void;
  later: (work: () => void) => void;
  missed: RefObject<boolean>;
};

export type { BuildStep, MockWorld };
