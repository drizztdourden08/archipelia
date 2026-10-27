/* @layer renderer-app @kind logic */
import type { LobbySource, SessionTemplate } from '@archipelia/model';
import type { HostPlayerSlot, LobbyRequest } from './lobbies.type';
import { sessionLobby } from './session-lobby';

const lobbyRequest = {
  open: (template: SessionTemplate, source?: LobbySource): LobbyRequest => ({
    type: 'lobby.create', params: { ...sessionLobby(template), ...(source ? { source } : {}), ...(template.direct ? {} : { locked: true }) },
  }),
  update: (lobbyId: string, template: SessionTemplate, source?: LobbySource): LobbyRequest => ({
    type: 'lobby.update', params: { lobbyId, ...sessionLobby(template), ...(source ? { source } : {}) },
  }),
  lock: (lobbyId: string): LobbyRequest => ({ type: 'lobby.lock', params: { lobbyId } }),
  unlock: (lobbyId: string): LobbyRequest => ({ type: 'lobby.unlock', params: { lobbyId } }),
  start: (lobbyId: string): LobbyRequest => ({ type: 'lobby.start', params: { lobbyId } }),
  close: (lobbyId: string): LobbyRequest => ({ type: 'lobby.close', params: { lobbyId } }),
  stopRoom: (lobbyId: string): LobbyRequest => ({ type: 'room.stop', params: { lobbyId } }),
  approve: (lobbyId: string, memberId: string): LobbyRequest => ({ type: 'member.approve', params: { lobbyId, memberId } }),
  refuse: (lobbyId: string, memberId: string): LobbyRequest => ({ type: 'member.refuse', params: { lobbyId, memberId } }),
  remove: (lobbyId: string, memberId: string): LobbyRequest => ({ type: 'member.remove', params: { lobbyId, memberId } }),
  host: (lobbyId: string, displayName: string, slots: readonly HostPlayerSlot[]): LobbyRequest => ({ type: 'member.host', params: { lobbyId, displayName, slots } }),
  consent: (lobbyId: string, sha256: string, allowed: boolean): LobbyRequest => ({ type: 'world.consent', params: { lobbyId, sha256, allowed } }),
};

export { lobbyRequest };
