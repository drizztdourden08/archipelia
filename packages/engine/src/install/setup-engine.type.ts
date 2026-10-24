/* @layer core @kind types */
import type { EngineChoice, EngineInstallResult, EngineStatus } from '@archipelia/model';

type SetupDeps = {
  root: string;
  target: string;
  install: (choice: EngineChoice) => Promise<EngineInstallResult>;
  status: () => Promise<EngineStatus>;
};

export type { SetupDeps };
