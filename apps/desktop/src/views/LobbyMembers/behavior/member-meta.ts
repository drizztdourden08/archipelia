/* @layer renderer-app @kind logic */
import type { AdminLobbyMember } from '@archipelia/model';
import { SLOT_STATES } from '../../../lobbies/lobby-statuses.constants';
import { memberLine } from './member-line';
import { trustTag } from './trust-tag';

const memberMeta = (member: AdminLobbyMember): string => {
  const games = [...new Set(member.slots.map((slot) => slot.game))].join(', ');
  const unready = member.slots.find((slot) => slot.state !== 'ok');
  const client = member.kind === 'client' ? `${memberLine(member)}, ${trustTag(member).text.toLowerCase()}` : memberLine(member);
  return [games, client, unready ? SLOT_STATES[unready.state].label : ''].filter(Boolean).join(' · ');
};

export { memberMeta };
