/* @layer renderer-app @kind types */
import type { BadgeVariant } from '@drizztdourden08/tessera/primitives';

type PlayerStatusRowProps = {
  slot: number;
  name: string;
  game: string;
  status: string;
  statusVariant: BadgeVariant;
  checks: string;
  progress: { value: number; max: number } | null;
};

export type { PlayerStatusRowProps };
