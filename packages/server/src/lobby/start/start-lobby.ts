/* @layer core @kind logic */
import { settleLobby } from '../checks/settle-lobby';
import type { LobbyContext } from '../lobby-context.type';
import { sendApproved } from '../member/send-approved';
import { participants } from './participants';
import { runLobby } from './run-lobby';
import { STARTABLE_PHASES } from './start.constants';
import type { StartedRun } from './start.type';

const startLobby = async (ctx: LobbyContext, lobbyId: string): Promise<StartedRun> => {
  const before = await ctx.book.get(lobbyId);
  if (!before) throw new Error(`no lobby has the id ${lobbyId}`);
  if (!STARTABLE_PHASES.includes(before.phase)) throw new Error(`the lobby is ${before.phase} and cannot start`);
  await settleLobby(ctx, lobbyId);
  const checked = await ctx.book.get(lobbyId);
  if (!checked || participants(checked).length === 0) throw new Error('no slot is ready to play');
  const lobby = await ctx.book.commit(lobbyId, (draft) => {
    draft.phase = 'generating';
    delete draft.failure;
  });
  ctx.publish(lobby);
  sendApproved(ctx.hub, lobby, { type: 'lobby.progress', phase: 'generating', step: 'generate', fraction: 0 });
  return { lobby, finished: runLobby(ctx, lobby) };
};

export { startLobby };
