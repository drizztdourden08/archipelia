/* @layer core @kind logic */
import type { Lobby, LobbyMember, SlotUpload } from '@archipelia/model';
import type { SlotVerdict } from './check-slot.type';

const stillMatches = (member: LobbyMember, slot: SlotUpload, verdict: SlotVerdict): boolean => {
  const same = slot.state === verdict.from && slot.yamlSha256 === verdict.yamlSha256 && slot.worldSha256 === verdict.worldSha256;
  return same && (member.admission === 'approved' || verdict.state === 'checking');
};

const setStates = (draft: Lobby, verdicts: SlotVerdict[]): SlotVerdict[] => {
  const applied: SlotVerdict[] = [];
  for (const verdict of verdicts) {
    const member = draft.members.find((candidate) => candidate.id === verdict.memberId);
    const slot = member?.slots.find((candidate) => candidate.name === verdict.slot);
    if (!member || !slot || !stillMatches(member, slot, verdict)) continue;
    slot.state = verdict.state;
    if (verdict.failure) slot.reason = verdict.failure.message;
    else delete slot.reason;
    applied.push(verdict);
  }
  return applied;
};

export { setStates };
