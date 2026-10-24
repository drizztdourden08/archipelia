/* @layer renderer-app @kind logic */
import type { LobbyDraft, LobbyRequest } from './lobbies.type';

const lobbyRequest = {
  create: ({ name, admission, allowUnlisted, maxSlots, room }: LobbyDraft): LobbyRequest => ({
    type: 'lobby.create',
    params: { name, options: { admission, allowUnlisted, maxSlots, room } },
  }),
  lock: (lobbyId: string): LobbyRequest => ({ type: 'lobby.lock', params: { lobbyId } }),
  start: (lobbyId: string): LobbyRequest => ({ type: 'lobby.start', params: { lobbyId } }),
  close: (lobbyId: string): LobbyRequest => ({ type: 'lobby.close', params: { lobbyId } }),
  stopRoom: (lobbyId: string): LobbyRequest => ({ type: 'room.stop', params: { lobbyId } }),
  approve: (lobbyId: string, memberId: string): LobbyRequest => ({ type: 'member.approve', params: { lobbyId, memberId } }),
  refuse: (lobbyId: string, memberId: string): LobbyRequest => ({ type: 'member.refuse', params: { lobbyId, memberId } }),
  remove: (lobbyId: string, memberId: string): LobbyRequest => ({ type: 'member.remove', params: { lobbyId, memberId } }),
  consent: (lobbyId: string, sha256: string, allowed: boolean): LobbyRequest => ({ type: 'world.consent', params: { lobbyId, sha256, allowed } }),
};

export { lobbyRequest };
