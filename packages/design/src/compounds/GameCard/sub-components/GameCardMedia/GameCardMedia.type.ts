/* @layer renderer-app @kind types */
import type { GameCardKind } from '../../GameCard.type';

type GameCardMediaProps = {
  kind: GameCardKind;
  art?: string;
};

export type { GameCardMediaProps };
