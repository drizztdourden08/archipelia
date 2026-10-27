/* @layer renderer-app @kind types */
import type { ServerEntry, SessionTemplate } from '@archipelia/model';
import type { SessionRowProps } from '@archipelia/design';

type SessionsCardProps = Pick<SessionRowProps, 'onEdit' | 'onStart' | 'onHistory' | 'onDuplicate' | 'onDelete'> & {
  templates: SessionTemplate[];
  total: number;
  loading: boolean;
  servers: ServerEntry[];
  runCounts: Record<string, number>;
  isBusy: (key: string) => boolean;
};

export type { SessionsCardProps };
