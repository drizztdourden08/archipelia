/* @layer renderer-app @kind types */
import type { GameCardKind, GameCardStatus } from '../../../GameCard';

type GameDetailsHeadProps = {
  kind: GameCardKind;
  kindLabel: string;
  art?: string | undefined;
  version?: string | undefined;
  verified?: boolean | undefined;
  status?: GameCardStatus | undefined;
};

export type { GameDetailsHeadProps };
