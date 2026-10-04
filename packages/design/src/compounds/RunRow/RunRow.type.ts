/* @layer renderer-app @kind types */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

type RunStatusView = { label: string; tone: StatusTone };

type RunRowProps = {
  id: string;
  when: string;
  name: string;
  host: string;
  status: RunStatusView;
  error?: string;
  hasLog: boolean;
  canDelete: boolean;
  busy?: boolean;
  onOpen: (id: string) => void;
  onShowLog: (id: string) => void;
  onDelete: (id: string) => void;
};

export type { RunRowProps, RunStatusView };
