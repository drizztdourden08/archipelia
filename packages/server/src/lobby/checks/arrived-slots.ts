/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { LobbyStore } from '../lobby-service.type';
import { liveMembers } from '../state/live-members';
import type { SlotVerdict } from './check-slot.type';
import { needsConsent } from './needs-consent';
import { verdictOf } from './verdict-of';

const arrivedSlots = async (store: LobbyStore, lobby: Lobby): Promise<SlotVerdict[]> => {
  const arrived: SlotVerdict[] = [];
  for (const member of liveMembers(lobby)) {
    for (const slot of member.slots.filter((candidate) => candidate.state === 'uploading')) {
      const files = [slot.yamlSha256, ...(slot.worldSha256 ? [slot.worldSha256] : [])];
      const held = await Promise.all(files.map((sha256) => store.hasFile(lobby.id, sha256)));
      if (held.every(Boolean)) arrived.push(verdictOf(member, slot, needsConsent(lobby, member, slot) ? 'waiting-consent' : 'checking'));
    }
  }
  return arrived;
};

export { arrivedSlots };
