/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, Inline, Status } from '@drizztdourden08/tessera/primitives';
import type { PlayerOverridesCellProps } from './PlayerOverridesCell.type';
import { overridesLabel } from '../../behavior/overrides-label';
import { playerLabel } from '../../behavior/player-label';

const PlayerOverridesCell = ({ player, selected, onEdit }: PlayerOverridesCellProps) => {
  const { slot, source } = player;
  const edit = useCallback(() => onEdit(slot), [onEdit, slot]);
  const changed = source.kind === 'preset' && Object.keys(source.overrides).length > 0;
  return (
    <Inline gap="xs" wrap>
      <Status tone={changed ? 'warning' : 'neutral'}>{overridesLabel(player)}</Status>
      <Button
        size="sm"
        variant={selected ? 'secondary' : 'ghost'}
        aria-pressed={selected}
        disabled={source.kind !== 'preset'}
        aria-label={`Edit overrides of ${playerLabel(player)}`}
        onClick={edit}
      >
        Edit
      </Button>
    </Inline>
  );
};

export { PlayerOverridesCell };
