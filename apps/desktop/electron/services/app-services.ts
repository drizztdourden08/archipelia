/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { app } from 'electron';
import { embedServer, lanAddresses } from '@drizztdourden08/brock-electron/main';
import { getSecrets } from '@drizztdourden08/brock-secrets/main';
import { startCore } from '@archipelia/server';
import type { CoreDomains, CoreEvent, StartedCore } from '@archipelia/server';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { createLobbyServices } from '../lobbies/create-lobby-services';
import { fakeLobbyRun } from '../lobbies/review/fake-lobby-run';
import { REVIEW_FLAG } from '../lobbies/review/review.constants';

const lanHost = () => lanAddresses().find((lan) => lan.family === 'IPv4')?.address ?? '127.0.0.1';

const forward = (ctx: MainContext, coreEvent: CoreEvent) => {
  if (coreEvent.kind === 'engine') ctx.emit(APP_CHANNELS.onEngineEvent, coreEvent.event);
  else if (coreEvent.kind === 'session' && (coreEvent.event.type === 'session' || coreEvent.event.type === 'log')) ctx.emit(APP_CHANNELS.onSessionEvent, coreEvent.event);
};

const createAppServices = async (ctx: MainContext) => {
  const secrets = getSecrets(ctx);
  const automation = ctx.flags.isAutomationLaunch();
  const version = app.getVersion();
  let started: StartedCore | undefined;
  await embedServer<CoreDomains>((host) => {
    started = startCore(host, {
      job: ctx.job,
      emit: (event) => forward(ctx, event),
      secrets,
      network: { automation, lanHost },
      environment: { version },
      ...(ctx.flags.hasFlag(REVIEW_FLAG) ? { lobbyRun: fakeLobbyRun } : {}),
    });
    return started;
  }, ctx, { domains: () => ctx.storage });
  if (!started) throw new Error('the embedded core did not start');
  const { core, listen } = started;
  const lobbies = await createLobbyServices({
    core, listen, domain: ctx.storage.domain, secrets, automation, lanHost, version, log: ctx.log,
    onLobby: (event) => ctx.emit(APP_CHANNELS.onLobbyEvent, event),
    onLan: (servers) => ctx.emit(APP_CHANNELS.onLanServers, servers),
  });
  return { ...core, secrets, ...lobbies };
};

export { createAppServices };
