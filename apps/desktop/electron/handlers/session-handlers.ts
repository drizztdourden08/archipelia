/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { runJobId } from '@archipelia/model';

const sessionHandlers: HandlerGroup = {
  id: 'archipelia-sessions',
  register: (ctx) => {
    const { live, runJobs, runs, sessionFiles, sessions } = ctx.services;
    ctx.handle(APP_CHANNELS.sessionsList, () => runs.newest());
    ctx.handle(APP_CHANNELS.sessionsRun, (_event, template) => sessions.run(template));
    ctx.handle(APP_CHANNELS.sessionsStart, (_event, sessionId, overrides) => live.start(sessionId, overrides));
    ctx.handle(APP_CHANNELS.sessionsRunLobby, (_event, tabId) => live.run(tabId));
    ctx.handle(APP_CHANNELS.liveList, () => live.list());
    ctx.handle(APP_CHANNELS.liveClose, (_event, tabId, mode) => live.close(tabId, mode));
    ctx.handle(APP_CHANNELS.sessionsStop, (_event, id) => sessions.stop(id));
    ctx.handle(APP_CHANNELS.sessionsCancel, (_event, id) => sessions.cancel(id));
    ctx.handle(APP_CHANNELS.sessionsCommand, (_event, id, cmd) => sessions.command(id, cmd));
    ctx.handle(APP_CHANNELS.sessionsLog, (_event, id) => sessions.logOf(id));
    ctx.handle(APP_CHANNELS.sessionsRemove, async (_event, id) => {
      await sessionFiles.remove(assertSafeName(id, 'session id'));
      await runs.remove(id);
    });
    ctx.handle(APP_CHANNELS.sessionsShowJob, async (_event, id) => {
      if (ctx.jobs.list().some((job) => job.id === runJobId(id) && job.state === 'running')) return;
      const session = await runs.get(id);
      if (!session) throw new Error(`run ${id} is not in the list`);
      runJobs.replay(session, await sessionFiles.readText(`${assertSafeName(id, 'session id')}/generate.log`));
    });
  },
};

export { sessionHandlers };
