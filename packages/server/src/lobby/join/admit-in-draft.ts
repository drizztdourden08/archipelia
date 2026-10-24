/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import { rejected } from '../state/rejected';
import { usedSlots } from '../state/used-slots';
import { admitSlots } from './admit-slots';
import type { Admitted, SlotRequest } from './admit-slots.type';
import { applySlots } from './apply-slots';
import { LOBBY_FULL, SLOTS_FROZEN } from './join.constants';

const admitInDraft = (draft: Lobby, memberId: string, request: SlotRequest): Admitted => {
  if (draft.phase !== 'open') throw rejected(SLOTS_FROZEN);
  const admitted = admitSlots(draft, memberId, request);
  if (!admitted.ok) throw rejected(admitted.failure);
  if (usedSlots(draft, memberId) + admitted.value.slots.length > draft.options.maxSlots) throw rejected(LOBBY_FULL);
  applySlots(draft, memberId, admitted.value);
  return admitted.value;
};

export { admitInDraft };
