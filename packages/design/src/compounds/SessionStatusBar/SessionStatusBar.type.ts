/* @layer renderer-app @kind types */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

type SessionStatusBarProps = {
  status: string;
  statusTone: StatusTone;
  name: string;
  host: string;
  address: string | null;
  roomUrl?: string;
  seed?: string;
  uptime: string | null;
  progress: string | null;
  copied: boolean;
  stoppable: boolean;
  onResetLayout: () => void;
  onCopy: () => void;
  onStop: () => void;
};

export type { SessionStatusBarProps };
