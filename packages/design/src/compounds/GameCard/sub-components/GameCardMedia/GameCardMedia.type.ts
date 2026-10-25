/* @layer renderer-app @kind types */
import type { GameCardKind } from '../../GameCard.type';

type GameCardMediaProps = {
  kind: GameCardKind;
  kindLabel: string;
  art?: string;
};

export type { GameCardMediaProps };
