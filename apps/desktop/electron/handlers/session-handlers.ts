/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { SessionTemplate } from '@archipelia/model';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { runJobId } from '@archipelia/model';
import { LOCAL_SERVER } from '../../src/lobbies/lobbies.constants';
import { lobbyServerOf } from '../../src/lobbies/lobby-server-of';
import { hostSlotOf } from '../sessions/host-slot-of';
import { openToNetwork } from '../sessions/open-to-network';
import { runSession } from '../sessions/run-session';
import { startSession } from '../sessions/start-session';

const sessionHandlers: HandlerGroup = {
  id: 'archipelia-sessions',
  register: (ctx) => {
    const { admins, installed, lobbyServer, presets, runJobs, runs, sessionFiles, sessions, shareRoomPassword } = ctx.services;
    const reach = openToNetwork(lobbyServer);
    ctx.handle(APP_CHANNELS.sessionsList, () => runs.newest());
    ctx.handle(APP_CHANNELS.sessionsRun, (_event, template) => sessions.run(template));
    const lobbyDeps = async (template: SessionTemplate) => {
      const serverId = lobbyServerOf(template);
      const ops = await admins.opsFor(serverId);
      return { act: ops.act, list: ops.list, slotOf: hostSlotOf(installed, presets), ...(serverId === LOCAL_SERVER ? { sharePassword: shareRoomPassword } : {}) };
    };
    ctx.handle(APP_CHANNELS.sessionsStart, async (_event, template) => {
      await reach(template);
      return startSession(template, await lobbyDeps(template));
    });
    ctx.handle(APP_CHANNELS.sessionsRunLobby, async (_event, template) => runSession(template, await lobbyDeps(template)));
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
