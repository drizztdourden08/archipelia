/* @layer renderer-app @kind logic */
import type { AdminLobby } from '@archipelia/model';

const readySlotCount = (lobby: AdminLobby): number =>
  lobby.members.filter((member) => member.admission === 'approved').reduce((sum, member) => sum + member.slots.filter((slot) => slot.state === 'ok').length, 0);

export { readySlotCount };
