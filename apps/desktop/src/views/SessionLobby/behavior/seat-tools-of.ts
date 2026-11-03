/* @layer renderer-app @kind logic */
import type { LobbySeatAction } from '@archipelia/design';
import { SEAT_TEXT } from '../SessionLobby.constants';
import type { OwnSeat, SeatContext } from '../SessionLobby.type';
import { playerLabel } from './player-label';

const seatToolsOf = ({ slot, player }: OwnSeat, fresh: boolean, { busy, actions }: SeatContext): LobbySeatAction[] => {
  const base = { nameSuffix: playerLabel(player), disabled: busy };
  const remove: LobbySeatAction = { ...base, id: 'remove', label: SEAT_TEXT.remove, icon: 'trash-2', onSelect: () => actions.remove(slot) };
  if (player.kind === 'direct' || fresh) return [remove];
  return [
    { ...base, id: 'edit', label: SEAT_TEXT.edit, icon: 'pencil', onSelect: () => actions.edit(slot) },
    { ...base, id: 'duplicate', label: SEAT_TEXT.duplicate, icon: 'copy', onSelect: () => actions.duplicate(slot) },
    remove,
  ];
};

export { seatToolsOf };
