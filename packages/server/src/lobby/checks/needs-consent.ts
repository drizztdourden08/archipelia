/* @layer core @kind logic */
import type { Lobby, LobbyMember, SlotUpload } from '@archipelia/model';
import { ownWorld } from '../state/own-world';

const needsConsent = (lobby: Lobby, member: LobbyMember, slot: SlotUpload): boolean => {
  const world = ownWorld(lobby, member.id, slot);
  return member.admission === 'approved' && world?.trust.level === 'unlisted' && !world.consent;
};

export { needsConsent };
