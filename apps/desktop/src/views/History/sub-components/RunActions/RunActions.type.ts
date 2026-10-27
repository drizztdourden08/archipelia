/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';

type RunActionsProps = {
  run: Session;
  sessionId: string | null;
  busy: boolean;
  onOpenRun: (run: Session) => void;
  onOpenSession: (sessionId: string) => void;
  onDelete: (run: Session) => void;
};

export type { RunActionsProps };
