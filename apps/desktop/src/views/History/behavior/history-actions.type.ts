/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';

type HistoryActionsInput = {
  runs: Session[];
  guard: (key: string, work: () => Promise<unknown>) => Promise<unknown>;
};

export type { HistoryActionsInput };
