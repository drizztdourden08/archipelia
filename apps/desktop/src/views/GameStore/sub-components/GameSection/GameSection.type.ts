/* @layer renderer-app @kind types */
import type { CardHandlers, GameSectionRows } from '../../GameStore.type';

type GameSectionProps = {
  section: GameSectionRows;
  resetKey: string;
  filtered: boolean;
  handlers: CardHandlers;
};

export type { GameSectionProps };
