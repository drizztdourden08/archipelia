/* @layer renderer-app @kind types */
import type { GameCardKind } from '../../../GameCard';

type GameDetailsMediaProps = {
  kind: GameCardKind;
  kindLabel: string;
  art?: string;
};

export type { GameDetailsMediaProps };
