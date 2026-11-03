/* @layer renderer-app @kind logic */
import { setPlayers } from '@archipelia/model';
import type { AdminLobbyMember, SessionPlayer } from '@archipelia/model';
import { openClaimsOf } from '../../../live/open-claims-of';
import type { OwnSeat } from '../SessionLobby.type';

const seatsOf = (players: readonly SessionPlayer[], saved: readonly SessionPlayer[], members: readonly AdminLobbyMember[]): OwnSeat[] => {
  const kept = new Set(setPlayers(saved).map((player) => player.name.toLowerCase()));
  let claimed = openClaimsOf(members);
  return players.flatMap((player): OwnSeat[] => {
    const seat = { key: `seat-${player.slot}`, slot: player.slot, player };
    if (player.kind === 'set') return [{ ...seat, kind: kept.has(player.name.toLowerCase()) ? 'saved' : 'added' }];
    if (claimed > 0) {
      claimed -= 1;
      return [];
    }
    return [{ ...seat, kind: 'held' }];
  });
};

export { seatsOf };
