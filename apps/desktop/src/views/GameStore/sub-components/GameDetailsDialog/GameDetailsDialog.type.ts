/* @layer renderer-app @kind types */
import type { CardHandlers, GameRow } from '../../GameStore.type';

type GameDetailsDialogProps = {
  row: GameRow;
  handlers: CardHandlers;
  onClose: () => void;
};

export type { GameDetailsDialogProps };
