/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';

const sessionHandlers: HandlerGroup = {
  id: 'archipelia-sessions',
  register: (ctx) => {
    const { runs, sessionFiles, sessions } = ctx.services;
    ctx.handle(APP_CHANNELS.sessionsList, () => runs.newest());
    ctx.handle(APP_CHANNELS.sessionsRun, (_event, template) => sessions.run(template));
    ctx.handle(APP_CHANNELS.sessionsStop, (_event, id) => sessions.stop(id));
    ctx.handle(APP_CHANNELS.sessionsCancel, (_event, id) => sessions.cancel(id));
    ctx.handle(APP_CHANNELS.sessionsCommand, (_event, id, cmd) => sessions.command(id, cmd));
    ctx.handle(APP_CHANNELS.sessionsLog, (_event, id) => sessions.logOf(id));
    ctx.handle(APP_CHANNELS.sessionsRemove, async (_event, id) => {
      await sessionFiles.remove(assertSafeName(id, 'session id'));
      await runs.remove(id);
    });
  },
};

export { sessionHandlers };
