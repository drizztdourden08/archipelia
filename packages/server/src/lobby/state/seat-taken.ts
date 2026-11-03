/* @layer core @kind logic */
import type { Lobby, LobbyMember } from '@archipelia/model';
import { liveMembers } from './live-members';

const holds = (member: LobbyMember, key: string): boolean => {
  const names = member.seat === undefined ? [member.displayName, ...member.slots.map((slot) => slot.name)] : [member.seat];
  return names.some((name) => name.toLowerCase() === key);
};

const seatTaken = (lobby: Lobby, name: string): boolean => {
  const key = name.toLowerCase();
  return liveMembers(lobby).some((member) => member.kind === 'client' && holds(member, key));
};

export { seatTaken };
