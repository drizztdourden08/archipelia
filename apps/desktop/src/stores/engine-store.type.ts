/* @layer renderer-app @kind types */
import type { EngineChoice, EngineEvent, EngineInstallResult, EngineOverview, EngineStatus } from '@archipelia/model';

type EngineState = {
  status: EngineStatus | null;
  overview: EngineOverview | null;
  refresh: () => Promise<void>;
  setup: () => Promise<void>;
  load: (force?: boolean) => Promise<void>;
  install: (choice: EngineChoice) => Promise<EngineInstallResult>;
  switchTo: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  apply: (event: EngineEvent) => void;
};

export type { EngineState };
