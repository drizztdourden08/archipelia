/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { SlotVerdict } from './check-slot.type';

const setStates = (draft: Lobby, verdicts: SlotVerdict[]) => {
  for (const verdict of verdicts) {
    const slot = draft.members.find((member) => member.id === verdict.memberId)?.slots.find((candidate) => candidate.name === verdict.slot);
    if (!slot) continue;
    slot.state = verdict.state;
    if (verdict.failure) slot.reason = verdict.failure.message;
    else delete slot.reason;
  }
};

export { setStates };
