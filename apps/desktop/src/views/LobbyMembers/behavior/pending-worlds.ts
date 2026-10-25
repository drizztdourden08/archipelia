/* @layer renderer-app @kind logic */
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import type { ConsentRequest } from '../LobbyDetail.type';

const pendingWorlds = (lobby: AdminLobby, member: AdminLobbyMember): ConsentRequest[] =>
  member.slots.flatMap((slot) => {
    const world = lobby.worlds.find((candidate) => candidate.sha256 === slot.worldSha256 && candidate.memberId === member.id);
    return slot.state === 'waiting-consent' && world ? [{ lobby, member, slot, world }] : [];
  });

export { pendingWorlds };
