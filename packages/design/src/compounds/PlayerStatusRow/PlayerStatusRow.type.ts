/* @layer renderer-app @kind types */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

type PlayerStatusRowProps = {
  slot: number;
  name: string;
  game: string;
  status: string;
  statusTone: StatusTone;
  checks: string;
  progress: { value: number; max: number } | null;
};

export type { PlayerStatusRowProps };
