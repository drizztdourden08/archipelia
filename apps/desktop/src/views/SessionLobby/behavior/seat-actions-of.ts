/* @layer renderer-app @kind logic */
import type { ActionItem } from '@drizztdourden08/tessera/composites';
import { SEAT_TEXT } from '../SessionLobby.constants';
import type { OwnSeat, SeatActions } from '../SessionLobby.type';

const seatActionsOf = ({ slot, kind }: OwnSeat, name: string, busy: boolean, actions: SeatActions): ActionItem[] => [
  { id: 'remove', label: SEAT_TEXT.remove, nameSuffix: name, icon: 'trash-2', kind: 'danger', confirm: false, disabled: busy, onSelect: () => actions.remove(slot) },
  { id: 'duplicate', label: SEAT_TEXT.duplicate, nameSuffix: name, icon: 'copy', disabled: busy, onSelect: () => actions.duplicate(slot) },
  ...(kind === 'added'
    ? [{ id: 'keep', label: SEAT_TEXT.keep, nameSuffix: name, icon: 'bookmark' as const, kind: 'primary' as const, disabled: busy, onSelect: () => actions.keep(slot) }]
    : []),
];

export { seatActionsOf };
