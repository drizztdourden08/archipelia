/* @layer renderer-app @kind types */
import type { ServerEntry, SessionTemplate } from '@archipelia/model';

type SessionsCardProps = {
  templates: SessionTemplate[];
  total: number;
  loading: boolean;
  servers: ServerEntry[];
  isBusy: (key: string) => boolean;
  onEdit: (id: string) => void;
  onRun: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { SessionsCardProps };
