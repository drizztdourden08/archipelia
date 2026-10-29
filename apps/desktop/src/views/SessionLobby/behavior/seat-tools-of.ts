/* @layer renderer-app @kind logic */
import type { LobbySeatAction } from '@archipelia/design';
import { SEAT_TEXT } from '../SessionLobby.constants';
import type { OwnSeat, SeatContext } from '../SessionLobby.type';

const seatToolsOf = ({ slot, kind }: OwnSeat, name: string, { busy, actions }: SeatContext): LobbySeatAction[] => {
  const edit: LobbySeatAction = { id: 'edit', label: SEAT_TEXT.edit, nameSuffix: name, icon: 'pencil', disabled: busy, onSelect: () => actions.edit(slot) };
  if (kind === 'held') return [edit];
  return [
    edit,
    { id: 'duplicate', label: SEAT_TEXT.duplicate, nameSuffix: name, icon: 'copy', disabled: busy, onSelect: () => actions.duplicate(slot) },
    { id: 'remove', label: SEAT_TEXT.remove, nameSuffix: name, icon: 'trash-2', disabled: busy, onSelect: () => actions.remove(slot) },
  ];
};

export { seatToolsOf };
