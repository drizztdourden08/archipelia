/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';

type HistoryCardProps = {
  runs: Session[];
  total: number;
  busy: string | null;
  onOpen: (id: string) => void;
  onShowLog: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { HistoryCardProps };
