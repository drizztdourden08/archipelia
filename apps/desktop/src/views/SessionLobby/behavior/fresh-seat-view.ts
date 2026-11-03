/* @layer renderer-app @kind logic */
import type { LobbySeatProps } from '@archipelia/design';
import type { SeatParts } from '../SessionLobby.type';
import { SLOT_TEXT } from './slot.constants';

const freshSeatView = (slot: number, { side, tools }: SeatParts): LobbySeatProps => ({
  state: 'new',
  name: SLOT_TEXT.newName,
  mark: String(slot),
  meta: [`${SLOT_TEXT.slot} ${slot}`, SLOT_TEXT.newMeta],
  side,
  tools,
});

export { freshSeatView };
