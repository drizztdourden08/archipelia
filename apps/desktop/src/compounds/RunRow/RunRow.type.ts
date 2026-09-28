/* @layer renderer-app @kind types */
import type { BadgeVariant } from '@drizztdourden08/tessera/primitives';

type RunRowProps = {
  id: string;
  when: string;
  name: string;
  host: string;
  status: { label: string; variant: BadgeVariant };
  error?: string;
  hasLog: boolean;
  canDelete: boolean;
  busy?: boolean;
  onOpen: (id: string) => void;
  onShowLog: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { RunRowProps };
