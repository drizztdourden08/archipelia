/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Toggle } from '@drizztdourden08/tessera/primitives';
import { playerLabel } from '../../behavior/player-label';
import type { DirectCellProps } from './DirectCell.type';

const DirectCell = ({ player, onChange }: DirectCellProps) => {
  const { slot } = player;
  const change = useCallback((on: boolean) => onChange(slot, on), [onChange, slot]);
  return <Toggle checked={player.direct === true} aria-label={`Lets ${playerLabel(player)} connect directly`} onChange={change} />;
};

export { DirectCell };
