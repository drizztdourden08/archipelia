/* @layer core @kind logic */
import type { Lobby, LobbyMember } from '@archipelia/model';

const liveMembers = (lobby: Lobby): LobbyMember[] =>
  lobby.members.filter((member) => member.admission === 'pending' || member.admission === 'approved');

export { liveMembers };
