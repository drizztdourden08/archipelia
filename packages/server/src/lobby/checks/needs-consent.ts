/* @layer core @kind logic */
import type { Lobby, LobbyMember, SlotUpload } from '@archipelia/model';

const needsConsent = (lobby: Lobby, member: LobbyMember, slot: SlotUpload): boolean => {
  const world = lobby.worlds.find((known) => known.sha256 === slot.worldSha256);
  return member.admission === 'approved' && world?.trust.level === 'unlisted' && !world.consent;
};

export { needsConsent };
