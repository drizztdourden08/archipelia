/* @layer renderer-app @kind logic */
import type { AdminLobbyMember } from '@archipelia/model';

const readySlots = (members: readonly AdminLobbyMember[]): number =>
  members.filter((member) => member.admission === 'approved').reduce((count, member) => count + member.slots.filter((slot) => slot.state === 'ok').length, 0);

export { readySlots };
