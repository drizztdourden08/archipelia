/* @layer renderer-app @kind logic */
import type { AdminLobbyMember } from '@archipelia/model';
import type { LobbyPending } from '../stores/session-view-store.type';
import { SEAT_TEXT } from './lobby-view.constants';

const clientOf = (member: AdminLobbyMember): string => {
  const client = member.client ? `${member.client.name} ${member.client.version}` : SEAT_TEXT.unknownClient;
  const trusted = member.trust === 'unlisted' ? `${client}, ${SEAT_TEXT.unlisted}` : client;
  return member.seat ? `${trusted}, ${SEAT_TEXT.wantsSeat(member.seat)}` : trusted;
};

const lobbyPendingOf = (members: readonly AdminLobbyMember[]): LobbyPending[] =>
  members.filter((member) => member.admission === 'pending').map((member) => ({ id: member.id, name: member.displayName, client: clientOf(member) }));

export { lobbyPendingOf };
