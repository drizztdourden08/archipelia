/* @layer renderer-app @kind types */
import type { BadgeVariant } from '@drizztdourden08/tessera/primitives';

type GameCardAction = { label: string; onClick: () => void; primary?: boolean; disabled?: boolean };

type GameCardProps = {
  title: string;
  source: string;
  badge?: { label: string; variant: BadgeVariant };
  details: string[];
  actions: GameCardAction[];
};

export type { GameCardProps };
