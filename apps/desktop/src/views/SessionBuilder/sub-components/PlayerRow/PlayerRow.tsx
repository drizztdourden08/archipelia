/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import { Box, Icon, Pressable, Text, Toggle } from '@drizztdourden08/tessera/primitives';
import { PLAYER_TEXT } from '../../SessionBuilder.constants';
import type { PlayerRowProps } from './PlayerRow.type';
import './PlayerRow.css';

const PlayerRow = ({ player, index, summary, problem, open, busy, on, children }: PlayerRowProps) => {
  const { slot } = player;
  const label = player.name.trim() || `Player ${slot}`;
  const edit = useCallback(() => on.edit(slot), [on, slot]);
  const direct = useCallback((checked: boolean) => on.direct(slot, checked), [on, slot]);
  const groups = useMemo<MenuGroup[]>(() => [{
    id: 'player',
    items: [
      { id: 'edit', label: open ? PLAYER_TEXT.done : PLAYER_TEXT.edit, icon: 'pencil', onSelect: () => on.edit(slot) },
      { id: 'duplicate', label: PLAYER_TEXT.duplicate, icon: 'copy', disabled: busy, onSelect: () => on.duplicate(slot) },
      { id: 'remove', label: PLAYER_TEXT.remove, icon: 'trash-2', tone: 'danger', disabled: busy, onSelect: () => on.remove(slot) },
    ],
  }], [busy, on, open, slot]);
  return (
    <Box as="li" className={open ? 'player-row player-row--open' : 'player-row'}>
      <Box className="player-row__line">
        <Text mono tone="muted" className="player-row__number">{index + 1}</Text>
        <Pressable className="player-row__pick" aria-expanded={open} title={`${open ? PLAYER_TEXT.done : PLAYER_TEXT.edit} ${label}`} onClick={edit}>
          <Text variant="body" className="player-row__name">{label}</Text>
          <Text variant="caption" tone={problem ? 'warning' : 'muted'} className="player-row__summary">
            {problem && <Icon name="triangle-alert" size={12} />}
            {problem ?? summary}
          </Text>
        </Pressable>
        <Box className="player-row__direct">
          <Toggle aria-label={`Lets ${label} connect directly`} checked={player.direct === true} onChange={direct} />
        </Box>
        <DropdownMenu trigger={{ label: `More actions for ${label}`, icon: 'ellipsis', iconOnly: true }} variant="ghost" size="sm" groups={groups} />
      </Box>
      {open && <Box className="player-row__editor">{children}</Box>}
    </Box>
  );
};

export { PlayerRow };
