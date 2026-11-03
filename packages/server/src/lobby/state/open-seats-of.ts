/* @layer core @kind logic */
import type { OpenSeats } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby } from '@archipelia/model';
import { liveMembers } from './live-members';

const seatsTakenBy = (lobby: Lobby): number =>
  liveMembers(lobby)
    .filter((member) => member.kind === 'client' && member.openSeat === true)
    .reduce((sum, member) => sum + Math.max(1, member.slots.length), 0);

const openSeatsOf = (lobby: Lobby): OpenSeats | undefined => {
  const total = lobby.openSeats ?? 0;
  return total > 0 ? { total, free: Math.max(0, total - seatsTakenBy(lobby)) } : undefined;
};

export { openSeatsOf };
