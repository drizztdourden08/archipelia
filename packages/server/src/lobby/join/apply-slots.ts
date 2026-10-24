/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { Admitted } from './admit-slots.type';

const applySlots = (draft: Lobby, memberId: string, admitted: Admitted) => {
  const member = draft.members.find((candidate) => candidate.id === memberId);
  if (!member) return;
  member.slots = admitted.slots;
  member.ready = false;
  draft.worlds = [...draft.worlds.filter((world) => world.memberId !== memberId), ...admitted.worlds.map((world) => ({ ...world, memberId }))];
};

export { applySlots };
