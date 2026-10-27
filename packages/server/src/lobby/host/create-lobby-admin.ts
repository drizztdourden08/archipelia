/* @layer core @kind logic */
import type { LobbyContext } from '../lobby-context.type';
import type { CreateLobbyInput, HostMemberInput, LobbyPatch } from '../lobby-service.type';
import { dismissMember } from '../member/dismiss-member';
import { startLobby } from '../start/start-lobby';
import { addHostMember } from './add-host-member';
import { approveMember } from './approve-member';
import { closeLobby } from './close-lobby';
import { consentWorld } from './consent-world';
import { createLobby } from './create-lobby';
import { lockLobby } from './lock-lobby';
import { unlockLobby } from './unlock-lobby';
import { sweepLobbies } from './sweep-lobbies';
import { updateLobby } from './update-lobby';

const createLobbyAdmin = (ctx: LobbyContext) => {
  const dismiss = (lobbyId: string, memberId: string, admission: 'refused' | 'removed', reason?: string) => {
    const why = reason ? { reason } : {};
    return dismissMember(ctx, { lobbyId, memberId }, { admission, ...why, message: { type: 'admission', state: admission, ...why } });
  };

  const stopRoom = async (lobbyId: string) => {
    const lobby = await ctx.book.get(lobbyId);
    if (!lobby?.sessionId || lobby.room?.state !== 'hosting') throw new Error('this lobby has no running room');
    await ctx.deps.runner.stop(lobby.sessionId);
    return ctx.book.get(lobbyId);
  };

  return {
    list: () => ctx.book.list(),
    get: (lobbyId: string) => ctx.book.get(lobbyId),
    create: (input: CreateLobbyInput) => createLobby(ctx, input),
    update: (lobbyId: string, patch: LobbyPatch) => updateLobby(ctx, lobbyId, patch),
    lock: (lobbyId: string) => lockLobby(ctx, lobbyId),
    unlock: (lobbyId: string) => unlockLobby(ctx, lobbyId),
    close: (lobbyId: string) => closeLobby(ctx, lobbyId),
    start: (lobbyId: string) => startLobby(ctx, lobbyId),
    stopRoom,
    approve: (lobbyId: string, memberId: string) => approveMember(ctx, { lobbyId, memberId }),
    refuse: (lobbyId: string, memberId: string, reason?: string) => dismiss(lobbyId, memberId, 'refused', reason),
    remove: (lobbyId: string, memberId: string, reason?: string) => dismiss(lobbyId, memberId, 'removed', reason),
    consent: (lobbyId: string, sha256: string, allowed: boolean) => consentWorld(ctx, lobbyId, sha256, allowed),
    addHost: (lobbyId: string, input: HostMemberInput) => addHostMember(ctx, lobbyId, input),
    sweep: () => sweepLobbies(ctx),
  };
};

export { createLobbyAdmin };
