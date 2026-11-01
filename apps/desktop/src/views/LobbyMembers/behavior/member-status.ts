/* @layer renderer-app @kind logic */
import type { LobbySeatStatus, LobbySeatTone } from '@archipelia/design';
import type { AdminLobbyMember } from '@archipelia/model';
import { SLOT_STATES } from '../../../lobbies/lobby-statuses.constants';
import { MEMBER_TEXT, SEAT_TONES } from '../LobbyMembers.constants';

const toneOf = (tone: string): LobbySeatTone => SEAT_TONES.find((entry) => entry === tone) ?? 'neutral';

const memberStatus = (member: AdminLobbyMember): LobbySeatStatus => {
  const unready = member.slots.find((slot) => slot.state !== 'ok');
  if (!unready) return { label: MEMBER_TEXT.ready, tone: member.slots.length > 0 ? 'success' : 'neutral' };
  const state = SLOT_STATES[unready.state];
  return { label: state.label, tone: toneOf(state.tone), title: unready.reason };
};

export { memberStatus };
