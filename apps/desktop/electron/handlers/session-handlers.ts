/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { sessionDirOf } from '@archipelia/sessions';

const sessionHandlers: HandlerGroup = {
  id: 'archipelia-sessions',
  register: (ctx) => {
    const { runs, sessions } = ctx.services;
    ctx.handle(APP_CHANNELS.sessionsList, () => runs.newest());
    ctx.handle(APP_CHANNELS.sessionsRun, (_event, template) => sessions.run(template));
    ctx.handle(APP_CHANNELS.sessionsStop, (_event, id) => sessions.stop(id));
    ctx.handle(APP_CHANNELS.sessionsCancel, (_event, id) => sessions.cancel(id));
    ctx.handle(APP_CHANNELS.sessionsCommand, (_event, id, cmd) => sessions.command(id, cmd));
    ctx.handle(APP_CHANNELS.sessionsLog, (_event, id) => sessions.logOf(id));
    ctx.handle(APP_CHANNELS.sessionsReadText, (_event, id, file) =>
      ctx.files.readText(`${sessionDirOf(assertSafeName(id, 'session id'))}/${assertSafeName(file, 'file name')}`));
    ctx.handle(APP_CHANNELS.sessionsRemove, async (_event, id) => {
      await ctx.files.remove(sessionDirOf(assertSafeName(id, 'session id')));
      await runs.remove(id);
    });
  },
};

export { sessionHandlers };
