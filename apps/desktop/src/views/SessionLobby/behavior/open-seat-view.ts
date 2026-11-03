/* @layer renderer-app @kind logic */
import type { LobbySeatProps } from '@archipelia/design';
import type { OwnSeat, SeatParts } from '../SessionLobby.type';
import { seatMetaOf } from './seat-meta-of';
import { SLOT_STATUS, SLOT_TEXT } from './slot.constants';

const openSeatView = (seat: OwnSeat, { side, tools }: SeatParts): LobbySeatProps => ({
  state: 'held',
  name: SLOT_TEXT.openName,
  mark: String(seat.slot),
  meta: seatMetaOf(seat, []),
  status: SLOT_STATUS.open,
  side,
  tools,
});

export { openSeatView };
