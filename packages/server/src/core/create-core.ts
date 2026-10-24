/* @layer core @kind logic */
import { createCatalogService, listInstalled } from '@archipelia/catalog';
import { currentTarget } from '@archipelia/engine';
import { apVersionOfTest, createHostFactory, GG_OWNER_SECRET, hostBinding } from '@archipelia/hosts';
import { DOMAIN } from '@archipelia/model';
import type { GameSchema } from '@archipelia/model';
import { createPresetStore } from '@archipelia/presets';
import { createRunStore, createServerStore, createSessionService, createTemplateStore } from '@archipelia/sessions';
import type { CorePorts } from './core-ports.type';
import { createEngineService } from './engine/create-engine-service';
import { createEngineUsage } from './engine/engine-usage';
import { createFeedStore } from '@archipelia/engine/install';
import { createRunJobs } from './runs/create-run-jobs';
import { createCoreLobbies } from './create-core-lobbies';

const createCore = (ports: CorePorts) => {
  const { domain, job, emit, secrets, log, network, environment = {} } = ports;
  const binding = hostBinding(network.automation, network.lanHost);
  const sessionFiles = domain(DOMAIN.sessions);
  const games = domain(DOMAIN.games);
  const cache = domain(DOMAIN.cache);
  const engineFiles = domain(DOMAIN.engine);
  const presets = createPresetStore(domain(DOMAIN.presets));
  const templates = createTemplateStore(sessionFiles);
  const runs = createRunStore(sessionFiles);
  const servers = createServerStore(domain(DOMAIN.servers));
  const usage = createEngineUsage();
  const engine = createEngineService({
    root: engineFiles.dir(), games, cache, size: (id) => engineFiles.size(id), feedStore: createFeedStore(cache),
    fetch: environment.fetch ?? ((url, init) => fetch(url, init)), target: environment.target ?? currentTarget(),
    platform: environment.platform ?? process.platform, startJob: job,
    emit: (event) => emit({ kind: 'engine', event }), sessions: () => runs.list(), inUse: usage.inUse,
  });
  const { runtime, runtimeFor } = engine;
  const catalog = createCatalogService({ games, cache, engineDir: engine.engineDir });
  const installed = () => listInstalled(games);
  const schemaOf = async (game: string): Promise<GameSchema | undefined> =>
    (await installed()).find((record) => record.game === game)?.schema;
  const remoteApVersion = async (serverId: string) => apVersionOfTest((await servers.require(serverId)).lastTest);
  const runJobs = createRunJobs({ job, cancel: (id) => sessions.cancel(id) });
  const sessions = createSessionService({
    files: sessionFiles, presets, runs, runtime, runtimeFor, remoteApVersion, schemaOf,
    hostFor: usage.watch(createHostFactory({ runtime, secrets, servers, ...binding, ggOwnerSecret: GG_OWNER_SECRET })),
    resolveSecret: (ref) => secrets.get(ref),
    emit: (event) => {
      usage.track(event);
      runJobs.onEvent(event);
      lobbies.onSessionEvent(event);
      emit({ kind: 'session', event });
    },
  });
  const { lobbies, watchLobbies, adminToken } = createCoreLobbies({ ports, sessions: () => sessions, runtime, runtimeFor, sessionFiles });
  const dispose = () => sessions.stopLocal().catch((err: unknown) => log(`the core did not stop its local servers: ${String(err)}`, 'error'));
  return { adminToken, catalog, dispose, engine, installed, lobbies, presets, runJobs, runs, runtime, servers, sessionFiles, sessions, templates, watchLobbies };
};

export { createCore };
