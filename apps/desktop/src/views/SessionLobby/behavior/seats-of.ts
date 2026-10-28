/* @layer renderer-app @kind logic */
import { isHosted } from '@archipelia/model';
import type { AdminLobbyMember, SessionPlayer } from '@archipelia/model';
import { CONNECTED_ADMISSIONS } from '../../../lobbies/lobbies.constants';
import type { OwnSeat } from '../SessionLobby.type';

const namesOf = (members: readonly AdminLobbyMember[]): Set<string> =>
  new Set(
    members
      .filter((member) => member.kind === 'client' && CONNECTED_ADMISSIONS.includes(member.admission))
      .flatMap((member) => [member.displayName, ...member.slots.map((slot) => slot.name)])
      .map((name) => name.toLowerCase()),
  );

const seatsOf = (players: readonly SessionPlayer[], saved: readonly SessionPlayer[], members: readonly AdminLobbyMember[]): OwnSeat[] => {
  const joined = namesOf(members);
  const kept = new Set(saved.map((player) => player.name.toLowerCase()));
  return players.flatMap((player): OwnSeat[] => {
    const seat = { key: `seat-${player.slot}`, slot: player.slot, player };
    if (isHosted(player)) return [{ ...seat, kind: kept.has(player.name.toLowerCase()) ? 'saved' : 'added' }];
    return joined.has(player.name.toLowerCase()) ? [] : [{ ...seat, kind: 'held' }];
  });
};

export { seatsOf };
