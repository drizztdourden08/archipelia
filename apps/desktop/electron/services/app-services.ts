/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { app } from 'electron';
import { embedServer, lanAddresses } from '@drizztdourden08/brock-electron/main';
import { getSecrets } from '@drizztdourden08/brock-secrets/main';
import { DOMAIN } from '@archipelia/model';
import { startCore } from '@archipelia/server';
import type { CoreDomains, CoreEvent, StartedCore } from '@archipelia/server';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { product } from '../../src/product';
import { createJoinServices } from '../joins/create-join-services';
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
  const review = ctx.flags.hasFlag(REVIEW_FLAG);
  const canStoreSecrets = () => !review && secrets.canStore();
  let started: StartedCore | undefined;
  await embedServer<CoreDomains>((host) => {
    started = startCore(host, {
      job: ctx.job,
      emit: (event) => forward(ctx, event),
      secrets,
      canStoreSecrets,
      network: { automation, lanHost },
      environment: { version },
      ...(review ? { lobbyRun: fakeLobbyRun } : {}),
    });
    return started;
  }, ctx, { domains: () => ctx.storage });
  if (!started) throw new Error('the embedded core did not start');
  const { core, listen } = started;
  const lobbies = await createLobbyServices({
    core, listen, domain: ctx.storage.domain, secrets, canStoreSecrets, automation, lanHost, version, log: ctx.log,
    onLobby: (event) => ctx.emit(APP_CHANNELS.onLobbyEvent, event),
    onLan: (servers) => ctx.emit(APP_CHANNELS.onLanServers, servers),
  });
  const joins = createJoinServices({
    core, files: ctx.storage.domain(DOMAIN.joins), name: product.name, version, log: ctx.log,
    emit: (view) => ctx.emit(APP_CHANNELS.onJoinEvent, view),
  });
  return { ...core, secrets, ...lobbies, joins };
};

export { createAppServices };
