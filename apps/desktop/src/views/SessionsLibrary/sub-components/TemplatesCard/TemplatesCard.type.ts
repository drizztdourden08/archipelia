/* @layer renderer-app @kind types */
import type { ServerEntry, SessionTemplate } from '@archipelia/model';

type TemplatesCardProps = {
  templates: SessionTemplate[];
  total: number;
  servers: ServerEntry[];
  isBusy: (key: string) => boolean;
  onEdit: (id: string) => void;
  onRun: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { TemplatesCardProps };
