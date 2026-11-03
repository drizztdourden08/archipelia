/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';
import type { SeatLeftOut } from './lobbies.type';
import { SLOT_STATES } from './lobby-statuses.constants';

const seatsLeftOut = (lobby: AdminLobby | undefined): SeatLeftOut[] =>
  (lobby?.members ?? []).filter((member) => member.admission === 'approved').flatMap((member) =>
    member.slots.filter((slot) => slot.state !== 'ok').map((slot) => ({ player: member.displayName, seat: slot.name, state: slot.state, reason: SLOT_STATES[slot.state].label })));

export { seatsLeftOut };
