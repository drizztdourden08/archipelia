/* @layer renderer-app @kind logic */
import type { SeatEditing } from '../SessionLobby.type';

const toggleOverrides = (current: SeatEditing | null, slot: number): SeatEditing => ({ slot, overrides: current?.slot === slot ? !current.overrides : true });

export { toggleOverrides };
