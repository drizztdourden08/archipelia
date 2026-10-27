/* @layer renderer-app @kind types */
import type { Session, SessionTemplate } from '@archipelia/model';

type HistoryDetailActions = {
  openRun: (run: Session) => void;
  openSession: (sessionId: string) => void;
  deleteRun: (run: Session) => void;
  showLog: (run: Session) => void;
};

type HistoryDetailProps = {
  run: Session;
  templates: readonly SessionTemplate[];
  busy: boolean;
  actions: HistoryDetailActions;
};

export type { HistoryDetailProps };
