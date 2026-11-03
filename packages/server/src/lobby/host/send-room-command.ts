/* @layer core @kind logic */
import type { LobbyContext } from '../lobby-context.type';
import { LINE_BREAK, ROOM_COMMAND_LIMIT } from './host.constants';

const sendRoomCommand = async (ctx: LobbyContext, lobbyId: string, line: string) => {
  if (line.trim() === '' || line.length > ROOM_COMMAND_LIMIT || LINE_BREAK.test(line)) throw new Error(`line must be one line of text, 1 to ${ROOM_COMMAND_LIMIT} characters`);
  const lobby = await ctx.book.get(lobbyId);
  if (!lobby?.sessionId || lobby.room?.state !== 'hosting' || !ctx.deps.runner.running(lobby.sessionId)) throw new Error('this lobby has no running room');
  await ctx.deps.runner.command(lobby.sessionId, line);
  return lobby;
};

export { sendRoomCommand };
