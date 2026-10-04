/* @layer renderer-app @kind types */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

type GameCardAction = { label: string; onClick: () => void; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean; loading?: boolean };

type GameCardProps = {
  title: string;
  source: string;
  status?: { label: string; tone: StatusTone };
  tag?: string;
  details: string[];
  actions: GameCardAction[];
};

export type { GameCardProps };
