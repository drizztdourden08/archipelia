/* @layer renderer-app @kind logic */
import type { SeatEditing } from '../SessionLobby.type';

const toggleSeat = (current: SeatEditing | null, slot: number): SeatEditing | null => (current?.slot === slot ? null : { slot, overrides: false });

export { toggleSeat };
