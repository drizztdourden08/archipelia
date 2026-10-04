/* @layer renderer-app @kind types */
import type { EngineStatus } from '@archipelia/model';

type EngineState = {
  status: EngineStatus | null;
  refresh: () => Promise<void>;
  setup: () => Promise<void>;
};

export type { EngineState };
