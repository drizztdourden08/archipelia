/* @layer renderer-app @kind types */
import type { LogRow } from '@drizztdourden08/tessera/composites';

type RunStepState = 'done' | 'current' | 'pending';

type RunProgressStep = { id: string; label: string; state: RunStepState };

type RunProgressPanelProps = {
  percent: number;
  line: string;
  steps: RunProgressStep[];
  failed: boolean;
  error?: string;
  seed?: string;
  logRows: LogRow[];
  showLog: boolean;
  logEmpty: string;
};

export type { RunProgressPanelProps, RunStepState };
