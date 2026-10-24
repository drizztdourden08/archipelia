/* @layer core @kind logic */
import type { Lobby, LobbyMember } from '@archipelia/model';

const activeMember = (lobby: Lobby | undefined, memberId: string): LobbyMember | undefined => {
  const member = lobby?.members.find((candidate) => candidate.id === memberId);
  return member?.admission === 'pending' || member?.admission === 'approved' ? member : undefined;
};

export { activeMember };
