/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Select } from '@drizztdourden08/tessera/primitives';
import { gameOptionsOf } from '../../behavior/game-options-of';
import { OWN_GAME } from '../../SessionLobby.constants';
import type { GameCellProps } from './GameCell.type';

const GameCell = ({ player, installed, onGame }: GameCellProps) => {
  const { slot } = player;
  const direct = player.kind === 'direct';
  const pick = useCallback((game: string) => onGame(slot, game === OWN_GAME ? '' : game), [onGame, slot]);
  return (
    <Select
      value={player.kind === 'set' ? player.game : OWN_GAME}
      options={gameOptionsOf(installed, player.kind === 'set' ? player.game : '', direct)}
      placeholder="Pick a game"
      searchable
      onChange={pick}
    />
  );
};

export { GameCell };
