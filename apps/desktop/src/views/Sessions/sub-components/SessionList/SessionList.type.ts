/* @layer renderer-app @kind types */
import type { ServerEntry, SessionTemplate } from '@archipelia/model';
import type { RunStats } from '../../../../runs/run-stats.type';

type SessionListProps = {
  templates: SessionTemplate[];
  servers: ServerEntry[];
  stats: Record<string, RunStats>;
  selectedId: string | null;
  withTab: ReadonlySet<string>;
  dirty: boolean;
  loading: boolean;
  isBusy: (key: string) => boolean;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { SessionListProps };
