/* @layer renderer-app @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import { ADMISSION_EVENT, LOBBY_EVENTS, PHASE_EVENT } from './lobby-events.constants';

const joinedLine = (member: AdminLobbyMember, at: number): HostLogLine => {
  const client = member.client ? ` (${member.client.name}${member.trust === 'unlisted' ? ', unlisted client' : ''})` : '';
  return { at, text: `${member.displayName} ${LOBBY_EVENTS.joined}${client}, ${ADMISSION_EVENT[member.admission]}` };
};

const changeOf = (before: AdminLobbyMember | undefined, member: AdminLobbyMember, at: number): HostLogLine[] => {
  if (!before) return [joinedLine(member, at)];
  if (before.admission !== member.admission) return [{ at, text: `${member.displayName} ${ADMISSION_EVENT[member.admission]}` }];
  return !before.ready && member.ready ? [{ at, text: `${member.displayName} ${LOBBY_EVENTS.ready}` }] : [];
};

const firstEvents = (lobby: AdminLobby): HostLogLine[] => [
  { at: lobby.createdAt, text: LOBBY_EVENTS.opened },
  ...lobby.members.filter((member) => member.kind === 'client').map((member) => joinedLine(member, member.joinedAt)),
];

const lobbyEventsOf = (before: AdminLobby | undefined, lobby: AdminLobby, at: number): HostLogLine[] => {
  if (!before) return firstEvents(lobby);
  const phase = before.phase === lobby.phase ? [] : [{ at, text: PHASE_EVENT[lobby.phase] }];
  return [...phase, ...lobby.members.filter((member) => member.kind === 'client').flatMap((member) => changeOf(before.members.find((entry) => entry.id === member.id), member, at))];
};

export { lobbyEventsOf };
