/* @layer renderer-app @kind types */
import type { Session } from '@archipelia/model';

type RunsCardProps = {
  runs: Session[];
  total: number;
  loading: boolean;
  isBusy: (key: string) => boolean;
  onOpen: (id: string) => void;
  onShowLog: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { RunsCardProps };
