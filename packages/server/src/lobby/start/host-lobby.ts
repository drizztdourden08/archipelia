/* @layer core @kind logic */
import type { Session } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { ROOM_TTL_MS } from '../lobby.constants';
import { roomFiles } from './room-files';
import { roomOf } from './room-of';
import { startedFor } from './started-for';
import type { Participant } from './start.type';

const hostLobby = async (ctx: LobbyContext, lobbyId: string, session: Session, players: Participant[]) => {
  const zip = session.output ? await ctx.deps.runner.output.readBytes(`${session.id}/output/${session.output.zip}`) : null;
  const lobby = await ctx.book.commit(lobbyId, (draft) => {
    draft.phase = 'hosting';
    draft.sessionId = session.id;
    draft.room = roomOf(session, session.snapshot.server.passwordRef, roomFiles(zip, players));
    draft.closesAt = ctx.now() + ROOM_TTL_MS;
    delete draft.failure;
  });
  ctx.publish(lobby);
  for (const memberId of ctx.hub.connected(lobbyId)) {
    const started = await startedFor(ctx, lobby, memberId);
    if (started) ctx.hub.send({ lobbyId, memberId }, started);
  }
  return lobby;
};

export { hostLobby };
