/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';

const used = (admission: string): boolean => admission === 'pending' || admission === 'approved';

const usedSlotCount = (lobby: AdminLobby): number =>
  lobby.members.filter((member) => used(member.admission)).reduce((sum, member) => sum + (member.kind === 'client' ? Math.max(1, member.slots.length) : member.slots.length), 0);

export { usedSlotCount };
