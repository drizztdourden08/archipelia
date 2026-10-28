/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Select } from '@drizztdourden08/tessera/primitives';
import { gameOptionsOf } from '../../behavior/game-options-of';
import { OWN_GAME } from '../../SessionLobby.constants';
import type { GameCellProps } from './GameCell.type';

const GameCell = ({ player, installed, onGame }: GameCellProps) => {
  const { slot, direct } = player;
  const pick = useCallback((game: string) => onGame(slot, game === OWN_GAME ? '' : game), [onGame, slot]);
  return (
    <Select
      value={player.game ?? (direct ? OWN_GAME : '')}
      options={gameOptionsOf(installed, player.game ?? '', direct === true)}
      placeholder="Pick a game"
      searchable
      onChange={pick}
    />
  );
};

export { GameCell };
