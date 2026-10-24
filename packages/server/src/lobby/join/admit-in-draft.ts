/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import { rejected } from '../state/rejected';
import { usedSlots } from '../state/used-slots';
import { admitSlots } from './admit-slots';
import type { Admitted, SlotRequest } from './admit-slots.type';
import { applySlots } from './apply-slots';
import { LOBBY_FULL, NO_SLOTS, SLOTS_FROZEN } from './join.constants';

const usedWorlds = (admitted: Admitted): Admitted => {
  const used = new Set(admitted.slots.map((slot) => slot.worldSha256));
  return { ...admitted, worlds: admitted.worlds.filter((world) => used.has(world.sha256)) };
};

const admitInDraft = (draft: Lobby, memberId: string, request: SlotRequest, joining = false): Admitted => {
  if (draft.phase !== 'open') throw rejected(SLOTS_FROZEN);
  const admitted = admitSlots(draft, memberId, request);
  if (!admitted.ok) throw rejected(admitted.failure);
  if (!joining && admitted.value.slots.length === 0) throw rejected(admitted.value.notices[0] ?? NO_SLOTS);
  const kept = joining ? admitted.value : usedWorlds(admitted.value);
  if (usedSlots(draft, memberId) + Math.max(1, kept.slots.length) > draft.options.maxSlots) throw rejected(LOBBY_FULL);
  applySlots(draft, memberId, kept);
  return kept;
};

export { admitInDraft };
