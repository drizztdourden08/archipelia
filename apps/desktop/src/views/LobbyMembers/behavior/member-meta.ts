/* @layer renderer-app @kind logic */
import type { AdminLobbyMember } from '@archipelia/model';
import { MEMBER_TEXT } from '../LobbyMembers.constants';
import { memberLine } from './member-line';
import { trustTag } from './trust-tag';

const memberMeta = (member: AdminLobbyMember): string[] => {
  const games = [...new Set(member.slots.map((slot) => slot.game))].join(', ');
  const client = member.kind === 'client' ? `${memberLine(member)}, ${trustTag(member).text.toLowerCase()}` : memberLine(member);
  return [[games, MEMBER_TEXT.joined].filter(Boolean).join(' · '), client];
};

export { memberMeta };
