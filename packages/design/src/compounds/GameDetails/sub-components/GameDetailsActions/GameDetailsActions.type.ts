/* @layer renderer-app @kind types */
import type { GameCardAction } from '../../../GameCard';

type GameDetailsActionsProps = {
  actions: GameCardAction[];
  busy?: string;
};

export type { GameDetailsActionsProps };
