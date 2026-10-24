/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { lanAddresses } from '@drizztdourden08/brock-electron/main';
import { getSecrets } from '@drizztdourden08/brock-secrets/main';
import { createCatalogService, listInstalled } from '@archipelia/catalog';
import { currentTarget } from '@archipelia/engine';
import { apVersionOfTest, createHostFactory, GG_OWNER_SECRET } from '@archipelia/hosts';
import type { GameSchema } from '@archipelia/model';
import { createPresetStore } from '@archipelia/presets';
import { createRunStore, createServerStore, createSessionService, createTemplateStore } from '@archipelia/sessions';
import { createEngineService } from '../engine/create-engine-service';
import { createEngineUsage } from '../engine/engine-usage';
import { engineRoot } from '../engine/engine-root';
import { createFeedStore } from '../engine/feed-store';
import { DOMAIN } from '../../src/storage/domains.constants';
import { createRunJobs } from '../runs/create-run-jobs';

const advertiseHost = () => lanAddresses().find((lan) => lan.family === 'IPv4')?.address ?? '127.0.0.1';

const createAppServices = (ctx: MainContext) => {
  const sessionFiles = ctx.storage.domain(DOMAIN.sessions);
  const games = ctx.storage.domain(DOMAIN.games);
  const cache = ctx.storage.domain(DOMAIN.cache);
  const engineFiles = ctx.storage.domain(DOMAIN.engine);
  const presets = createPresetStore(ctx.storage.domain(DOMAIN.presets));
  const templates = createTemplateStore(sessionFiles);
  const runs = createRunStore(sessionFiles);
  const servers = createServerStore(ctx.storage.domain(DOMAIN.servers));
  const usage = createEngineUsage();
  const engine = createEngineService({
    root: engineRoot(ctx), games, cache, size: (id) => engineFiles.size(id), feedStore: createFeedStore(cache),
    fetch: (url, init) => fetch(url, init), target: currentTarget(), platform: process.platform, startJob: ctx.job,
    emit: (event) => ctx.emit(APP_CHANNELS.onEngineEvent, event), sessions: () => runs.list(), inUse: usage.inUse,
  });
  const { runtime, runtimeFor } = engine;
  const catalog = createCatalogService({ games, cache, engineDir: engine.engineDir });
  const secrets = getSecrets(ctx);
  const installed = () => listInstalled(games);
  const schemaOf = async (game: string): Promise<GameSchema | undefined> =>
    (await installed()).find((record) => record.game === game)?.schema;
  const remoteApVersion = async (serverId: string) => apVersionOfTest((await servers.require(serverId)).lastTest);
  const runJobs = createRunJobs({ job: ctx.job, cancel: (id) => sessions.cancel(id) });
  const sessions = createSessionService({
    files: sessionFiles, presets, runs, runtime, runtimeFor, remoteApVersion, schemaOf,
    hostFor: usage.watch(createHostFactory({ runtime, secrets, servers, advertiseHost, ggOwnerSecret: GG_OWNER_SECRET })),
    resolveSecret: (ref) => secrets.get(ref),
    emit: (event) => {
      usage.track(event);
      runJobs.onEvent(event);
      if (event.type === 'session' || event.type === 'log') ctx.emit(APP_CHANNELS.onSessionEvent, event);
    },
  });
  const dispose = () => sessions.stopLocal();
  return { catalog, dispose, engine, installed, presets, runJobs, runs, runtime, secrets, servers, sessionFiles, sessions, templates };
};

export { createAppServices };
