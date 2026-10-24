/* @layer core @kind logic */
import type { ServerMessage } from '@archipelia/lobby-protocol';
import type { Lobby } from '@archipelia/model';
import type { LobbyLink, MemberRef } from '../lobby-service.type';
import { lobbyView } from '../state/lobby-view';
import type { HubEntry } from './lobby-hub.type';

const createLobbyHub = (serverVersion: string) => {
  const links = new Map<string, Map<string, HubEntry>>();
  const entries = (lobbyId: string) => links.get(lobbyId) ?? new Map<string, HubEntry>();

  const attach = (ref: MemberRef, link: LobbyLink): LobbyLink | undefined => {
    const members = entries(ref.lobbyId);
    const previous = members.get(ref.memberId)?.link;
    members.set(ref.memberId, { link });
    links.set(ref.lobbyId, members);
    return previous;
  };

  const detach = (ref: MemberRef, link: LobbyLink) => {
    const members = entries(ref.lobbyId);
    if (members.get(ref.memberId)?.link === link) members.delete(ref.memberId);
  };

  const send = (ref: MemberRef, message: ServerMessage) => entries(ref.lobbyId).get(ref.memberId)?.link.send(message);

  const close = (ref: MemberRef, code: number) => {
    const entry = entries(ref.lobbyId).get(ref.memberId);
    entries(ref.lobbyId).delete(ref.memberId);
    entry?.link.close(code);
  };

  const publish = (lobby: Lobby) => {
    for (const [memberId, entry] of entries(lobby.id)) {
      const member = lobby.members.find((candidate) => candidate.id === memberId);
      if (!member) continue;
      const view = lobbyView(lobby, member, serverVersion);
      const seen = JSON.stringify({ ...view, rev: 0 });
      if (seen === entry.seen) continue;
      entry.seen = seen;
      entry.link.send(view);
    }
  };

  const connected = (lobbyId: string) => [...entries(lobbyId).keys()];

  return { attach, close, connected, detach, publish, send };
};

export { createLobbyHub };
