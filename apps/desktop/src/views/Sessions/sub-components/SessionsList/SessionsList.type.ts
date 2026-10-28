/* @layer renderer-app @kind types */
import type { ServerEntry, SessionTemplate } from '@archipelia/model';
import type { RunStats } from '../../../../runs/run-stats.type';

type SessionsListProps = {
  templates: SessionTemplate[];
  servers: ServerEntry[];
  stats: Record<string, RunStats>;
  selectedId: string | null;
  loading: boolean;
  isBusy: (key: string) => boolean;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { SessionsListProps };
