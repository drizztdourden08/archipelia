/* @layer core @kind logic */
import { CLOSE_CODES, createError } from '@archipelia/lobby-protocol';
import type { LobbyContext } from '../lobby-context.type';
import { LOBBY_CLOSED } from '../join/join.constants';
import { OVERLAY_DIR } from '../lobby.constants';

const closeLobby = async (ctx: LobbyContext, lobbyId: string) => {
  const before = await ctx.book.get(lobbyId);
  if (before?.room?.state === 'hosting' && before.sessionId) await ctx.deps.runner.stop(before.sessionId).catch(() => undefined);
  const lobby = await ctx.book.commit(lobbyId, (draft) => {
    draft.phase = 'closed';
    draft.closesAt = ctx.now();
    if (draft.room) draft.room.state = 'stopped';
  });
  ctx.uploads.forgetLobby(lobbyId);
  await Promise.all((await ctx.deps.store.listFiles(lobbyId)).map((sha256) => ctx.deps.store.removeFile(lobbyId, sha256)));
  await ctx.deps.store.removeDir(lobbyId, OVERLAY_DIR);
  ctx.publish(lobby);
  for (const memberId of ctx.hub.connected(lobbyId)) {
    ctx.hub.send({ lobbyId, memberId }, createError(LOBBY_CLOSED, { welcomed: true }));
    ctx.hub.close({ lobbyId, memberId }, CLOSE_CODES.lobbyEnded);
  }
  return lobby;
};

export { closeLobby };
