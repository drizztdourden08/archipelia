/* @layer core @kind logic */
import type { EngineProgress, Session } from '@archipelia/model';
import type { SessionEvent } from '@archipelia/sessions';
import type { LobbyContext } from '../lobby-context.type';
import { ROOM_TTL_MS } from '../lobby.constants';
import { sendApproved } from '../member/send-approved';
import { hostStep } from './host-step';
import { ENGINE_STAGES, GENERATE_SHARE, HOSTING_FRACTION } from './start.constants';

const onStatus = async (ctx: LobbyContext, lobbyId: string, session: Session) => {
  const lobby = await ctx.book.get(lobbyId);
  if (!lobby) return;
  if (session.status === 'starting') {
    sendApproved(ctx.hub, lobby, { type: 'lobby.progress', phase: 'hosting', step: hostStep(lobby.options.room), fraction: HOSTING_FRACTION });
  }
  if (session.status !== 'stopped' || lobby.sessionId !== session.id || !lobby.room) return;
  const stopped = await ctx.book.commit(lobbyId, (draft) => {
    if (draft.room) draft.room.state = 'stopped';
    draft.closesAt = ctx.now() + ROOM_TTL_MS;
  });
  ctx.publish(stopped);
  sendApproved(ctx.hub, stopped, { type: 'room.status', state: 'stopped' });
};

const onProgress = async (ctx: LobbyContext, lobbyId: string, progress: EngineProgress) => {
  const lobby = await ctx.book.get(lobbyId);
  if (lobby?.phase !== 'generating') return;
  const fraction = (Math.max(0, ENGINE_STAGES.indexOf(progress.stage)) / ENGINE_STAGES.length) * GENERATE_SHARE;
  sendApproved(ctx.hub, lobby, { type: 'lobby.progress', phase: 'generating', step: 'generate', fraction });
};

const createSessionTracker = (ctx: LobbyContext) => {
  const running = new Map<string, string>();
  const report = (work: Promise<void>) => work.catch((error: unknown) => ctx.deps.log(`a lobby did not follow its run: ${String(error)}`));
  return (event: SessionEvent) => {
    if (event.type === 'session' && event.session.lobbyId) {
      running.set(event.session.id, event.session.lobbyId);
      void report(onStatus(ctx, event.session.lobbyId, event.session));
    }
    const lobbyId = event.type === 'progress' ? running.get(event.sessionId) : undefined;
    if (event.type === 'progress' && lobbyId) void report(onProgress(ctx, lobbyId, event.progress));
  };
};

export { createSessionTracker };
