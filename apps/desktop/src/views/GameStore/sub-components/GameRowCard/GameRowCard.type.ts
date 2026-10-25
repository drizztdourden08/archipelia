/* @layer renderer-app @kind types */
import type { CardHandlers, GameRow } from '../../GameStore.type';

type GameRowCardProps = {
  row: GameRow;
  handlers: CardHandlers;
};

export type { GameRowCardProps };
