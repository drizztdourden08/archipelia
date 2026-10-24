/* @layer core @kind logic */
import type { ServerMessage } from '@archipelia/lobby-protocol';
import { CLOSE_CODES, createError } from '@archipelia/lobby-protocol';
import type { LobbyContext } from '../lobby-context.type';
import type { LobbyLink, MemberRef } from '../lobby-service.type';
import { startedFor } from '../start/started-for';
import { REPLACED, TAKEOVER_WAIT_MS } from './join.constants';

const greetMember = async (ctx: LobbyContext, ref: MemberRef, link: LobbyLink, opening: ServerMessage[]) => {
  const previous = ctx.hub.attach(ref, link);
  if (previous && previous !== link) {
    await Promise.race([previous.drain?.(), new Promise((resolve) => setTimeout(resolve, TAKEOVER_WAIT_MS).unref())]);
    previous.send(createError(REPLACED, { welcomed: true }));
    previous.close(CLOSE_CODES.resumeReplaced);
  }
  for (const message of opening) link.send(message);
  const lobby = await ctx.book.get(ref.lobbyId);
  if (!lobby) return;
  ctx.publish(lobby);
  const started = await startedFor(ctx, lobby, ref.memberId);
  if (started) link.send(started);
};

export { greetMember };
