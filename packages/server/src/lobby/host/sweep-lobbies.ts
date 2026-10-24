/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { ROOM_TTL_MS } from '../lobby.constants';
import { closeLobby } from './close-lobby';

const expired = (lobby: Lobby, now: number) => lobby.phase !== 'closed' && lobby.room?.state !== 'hosting' && lobby.closesAt <= now;

const orphaned = (ctx: LobbyContext, lobby: Lobby) =>
  lobby.room?.state === 'hosting' && (lobby.sessionId === undefined || !ctx.deps.runner.running(lobby.sessionId));

const sweepLobbies = async (ctx: LobbyContext) => {
  for (const lobby of (await ctx.book.list()).filter((candidate) => orphaned(ctx, candidate))) {
    ctx.publish(await ctx.book.commit(lobby.id, (draft) => {
      if (draft.room) draft.room.state = 'stopped';
      draft.closesAt = ctx.now() + ROOM_TTL_MS;
    }));
  }
  const due = (await ctx.book.list()).filter((lobby) => expired(lobby, ctx.now()));
  for (const lobby of due) await closeLobby(ctx, lobby.id);
  return due.length;
};

export { sweepLobbies };
