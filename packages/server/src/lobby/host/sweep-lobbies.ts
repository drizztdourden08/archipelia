/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { closeLobby } from './close-lobby';

const expired = (lobby: Lobby, now: number) => lobby.phase !== 'closed' && lobby.room?.state !== 'hosting' && lobby.closesAt <= now;

const sweepLobbies = async (ctx: LobbyContext) => {
  const due = (await ctx.book.list()).filter((lobby) => expired(lobby, ctx.now()));
  for (const lobby of due) await closeLobby(ctx, lobby.id);
  return due.length;
};

export { sweepLobbies };
