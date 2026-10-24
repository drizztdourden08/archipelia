/* @layer core @kind logic */
import { CLOSE_CODES, createError } from '@archipelia/lobby-protocol';
import type { LobbyContext } from '../lobby-context.type';
import { LOBBY_CLOSED } from '../join/join.constants';
import { memberFiles } from '../state/member-files';

const closeLobby = async (ctx: LobbyContext, lobbyId: string) => {
  const before = await ctx.book.get(lobbyId);
  if (before?.room?.state === 'hosting' && before.sessionId) await ctx.deps.runner.stop(before.sessionId).catch(() => undefined);
  const lobby = await ctx.book.commit(lobbyId, (draft) => {
    draft.phase = 'closed';
    draft.closesAt = ctx.now();
    if (draft.room) draft.room.state = 'stopped';
  });
  const files = new Set(lobby.members.flatMap((member) => memberFiles(lobby, member).map((file) => file.sha256)));
  await Promise.all([...files].map((sha256) => ctx.deps.store.removeFile(lobbyId, sha256)));
  ctx.publish(lobby);
  for (const memberId of ctx.hub.connected(lobbyId)) {
    ctx.hub.send({ lobbyId, memberId }, createError(LOBBY_CLOSED, { welcomed: true }));
    ctx.hub.close({ lobbyId, memberId }, CLOSE_CODES.lobbyEnded);
  }
  return lobby;
};

export { closeLobby };
