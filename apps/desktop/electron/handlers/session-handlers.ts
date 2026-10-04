/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import { sessionDirOf } from '@archipelia/sessions';

const sessionHandlers: HandlerGroup = {
  id: 'archipelia-sessions',
  register: (ctx) => {
    const { runs, sessions } = ctx.services;
    ctx.handle('ap:sessions:list', () => runs.newest());
    ctx.handle('ap:sessions:run', (_event, template) => sessions.run(template));
    ctx.handle('ap:sessions:stop', (_event, id) => sessions.stop(id));
    ctx.handle('ap:sessions:cancel', (_event, id) => sessions.cancel(id));
    ctx.handle('ap:sessions:command', (_event, id, cmd) => sessions.command(id, cmd));
    ctx.handle('ap:sessions:log', (_event, id) => sessions.logOf(id));
    ctx.handle('ap:sessions:readText', (_event, id, file) =>
      ctx.files.readText(`${sessionDirOf(assertSafeName(id, 'session id'))}/${assertSafeName(file, 'file name')}`));
    ctx.handle('ap:sessions:remove', async (_event, id) => {
      await ctx.files.remove(sessionDirOf(assertSafeName(id, 'session id')));
      await runs.remove(id);
    });
  },
};

export { sessionHandlers };
