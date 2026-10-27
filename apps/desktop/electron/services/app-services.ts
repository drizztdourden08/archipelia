/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { app } from 'electron';
import { embedServer, lanAddresses } from '@drizztdourden08/brock-electron/main';
import { getSecrets } from '@drizztdourden08/brock-secrets/main';
import { DOMAIN } from '@archipelia/model';
import type { Session } from '@archipelia/model';
import { startCore } from '@archipelia/server';
import type { CoreDomains, CoreEvent, StartedCore } from '@archipelia/server';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { product } from '../../src/product';
import { createJoinServices } from '../joins/create-join-services';
import { createLobbyServices } from '../lobbies/create-lobby-services';
import { createLiveService } from '../live/create-live-service';
import { createLiveSessions } from '../live/create-live-sessions';
import { createLobbyCloser } from '../sessions/create-lobby-closer';
import { assertLanConsent } from '../sessions/assert-lan-consent';
import { hostSlotOf } from '../sessions/host-slot-of';
import { openToNetwork } from '../sessions/open-to-network';
import { prepareRun } from '../sessions/prepare-run';
import { fakeLobbyRun } from '../lobbies/review/fake-lobby-run';
import { REVIEW_FLAG } from '../lobbies/review/review.constants';
import { createBuildRunner } from '../builds/create-build-runner';
import { createToolRunner } from '../builds/create-tool-runner';
import { defineBuildProcesses } from '../builds/define-build-processes';
import { defineToolProcesses } from '../builds/define-tool-processes';

const lanHost = () => lanAddresses().find((lan) => lan.family === 'IPv4')?.address ?? '127.0.0.1';

const forward = (ctx: MainContext, coreEvent: CoreEvent) => {
  if (coreEvent.kind === 'engine') ctx.emit(APP_CHANNELS.onEngineEvent, coreEvent.event);
  else if (coreEvent.kind === 'session' && (coreEvent.event.type === 'session' || coreEvent.event.type === 'log')) ctx.emit(APP_CHANNELS.onSessionEvent, coreEvent.event);
};

const createAppServices = async (ctx: MainContext) => {
  let onSession: (session: Session) => void = () => undefined;
  const secrets = getSecrets(ctx);
  const automation = ctx.flags.isAutomationLaunch();
  const version = app.getVersion();
  const review = ctx.flags.hasFlag(REVIEW_FLAG);
  const canStoreSecrets = () => !review && secrets.canStore();
  let started: StartedCore | undefined;
  await embedServer<CoreDomains>((host) => {
    started = startCore(host, {
      job: ctx.job,
      emit: (event) => {
        forward(ctx, event);
        if (event.kind === 'session' && event.event.type === 'session') onSession(event.event.session);
      },
      secrets,
      canStoreSecrets,
      network: { automation, lanHost },
      environment: { version },
      build: createBuildRunner(ctx.processes),
      tool: createToolRunner(ctx.processes),
      ...(review ? { lobbyRun: fakeLobbyRun } : {}),
    });
    return started;
  }, ctx, { domains: () => ctx.storage });
  if (!started) throw new Error('the embedded core did not start');
  const { core, listen } = started;
  defineBuildProcesses(ctx.processes, (job, raw) => core.catalog.sources.processSpec(job, raw));
  defineToolProcesses(ctx.processes, (raw) => core.catalog.sources.toolSpec(raw));
  const lobbies = await createLobbyServices({
    core, listen, domain: ctx.storage.domain, secrets, canStoreSecrets, automation, lanHost, version, log: ctx.log,
    onLobby: (event) => ctx.emit(APP_CHANNELS.onLobbyEvent, event),
    onLan: (servers) => ctx.emit(APP_CHANNELS.onLanServers, servers),
  });
  const joins = createJoinServices({
    core, files: ctx.storage.domain(DOMAIN.joins), name: product.name, version, log: ctx.log,
    emit: (view) => ctx.emit(APP_CHANNELS.onJoinEvent, view),
  });
  const { lobbyServer } = lobbies;
  const liveStore = createLiveSessions({ files: ctx.storage.domain(DOMAIN.server), emit: (tabs) => ctx.emit(APP_CHANNELS.onLiveEvent, tabs) });
  const closer = createLobbyCloser({
    files: ctx.storage.domain(DOMAIN.server), opsFor: (serverId) => lobbies.admins.opsFor(serverId), live: () => liveStore.list(),
    quiet: () => (lobbyServer.status().options.mode === 'off' ? Promise.resolve() : lobbyServer.apply({ ...lobbyServer.status().options, mode: 'off' })),
    emit: (pending) => ctx.emit(APP_CHANNELS.onPendingCloses, pending),
    forget: (lobbyId) => core.lobbyPasswords.forget(lobbyId),
  });
  void closer.retryAll().catch((error: unknown) => ctx.log(`the pending lobby closes did not run: ${String(error)}`));
  const live = createLiveService({
    store: liveStore, templates: core.templates, closer, cancelRun: (runId) => core.sessions.cancel(runId),
    library: async () => ({ installed: await core.installed(), presets: await core.presets.list() }),
    lobbies: (serverId) => lobbies.admins.opsFor(serverId), slotOf: hostSlotOf(core.installed, core.presets),
    beforeOpen: openToNetwork(lobbyServer), assertConsent: (template) => assertLanConsent(lobbyServer, template), beforeRun: prepareRun({ server: lobbyServer, setLanRoom: core.setLanRoom, sharePassword: core.lobbyPasswords.share }),
  });
  onSession = ({ id, lobbyId }) => { if (lobbyId) void live.attachRun(lobbyId, id).catch((error: unknown) => ctx.log(`the live tab did not get its run: ${String(error)}`)); };
  void live.settle().catch((error: unknown) => ctx.log(`the live tabs did not settle: ${String(error)}`));
  return { ...core, secrets, ...lobbies, joins, closer, live };
};

export { createAppServices };
