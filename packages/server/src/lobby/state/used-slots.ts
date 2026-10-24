/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import { liveMembers } from './live-members';

const usedSlots = (lobby: Lobby, except?: string): number =>
  liveMembers(lobby).filter((member) => member.id !== except).reduce((sum, member) => sum + member.slots.length, 0);

export { usedSlots };
