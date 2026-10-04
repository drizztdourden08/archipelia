/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';

type HistoryCardProps = {
  runs: Session[];
  total: number;
  isBusy: (key: string) => boolean;
  onOpen: (id: string) => void;
  onShowLog: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { HistoryCardProps };
