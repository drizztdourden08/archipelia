/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

type PlayerStatusGoal = { label: string; done: boolean };

type PlayerStatusRowProps = {
  slot: number;
  name: string;
  game: string;
  kind?: string;
  status: string;
  statusTone: StatusTone;
  checks: string;
  progress: { value: number; max: number } | null;
  goal?: PlayerStatusGoal;
  menu?: ReactNode;
};

export type { PlayerStatusRowProps };
