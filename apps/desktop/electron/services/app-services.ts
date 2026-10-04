/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';
import { lanAddresses } from '@drizztdourden08/brock-electron/main';
import { getSecrets } from '@drizztdourden08/brock-secrets/main';
import { createCatalogService, listInstalled } from '@archipelia/catalog';
import { loadRuntime } from '@archipelia/engine';
import { createHostFactory, GG_OWNER_SECRET } from '@archipelia/hosts';
import type { GameSchema } from '@archipelia/model';
import { createPresetStore } from '@archipelia/presets';
import { createRunStore, createServerStore, createSessionService, createTemplateStore } from '@archipelia/sessions';
import { engineDirOf } from '../engine/engine-dir-of';
import { DOMAIN } from '../../src/storage/domains.constants';

const advertiseHost = () => lanAddresses().find((lan) => lan.family === 'IPv4')?.address ?? '127.0.0.1';

const createAppServices = (ctx: MainContext) => {
  const sessionFiles = ctx.storage.domain(DOMAIN.sessions);
  const games = ctx.storage.domain(DOMAIN.games);
  const engineDir = () => engineDirOf(ctx);
  const presets = createPresetStore(ctx.storage.domain(DOMAIN.presets));
  const templates = createTemplateStore(sessionFiles);
  const runs = createRunStore(sessionFiles);
  const servers = createServerStore(ctx.storage.domain(DOMAIN.servers));
  const catalog = createCatalogService({ games, cache: ctx.storage.domain(DOMAIN.cache), engineDir });
  const secrets = getSecrets(ctx);
  const runtime = () => loadRuntime(engineDir());
  const installed = () => listInstalled(games);
  const schemaOf = async (game: string): Promise<GameSchema | undefined> =>
    (await installed()).find((record) => record.game === game)?.schema;
  const sessions = createSessionService({
    files: sessionFiles, presets, runs, runtime, schemaOf,
    hostFor: createHostFactory({ runtime, secrets, servers, advertiseHost, ggOwnerSecret: GG_OWNER_SECRET }),
    resolveSecret: (ref) => secrets.get(ref),
    emit: (event) => ctx.emit(APP_CHANNELS.onSessionEvent, event),
  });
  const dispose = () => sessions.stopLocal();
  return { catalog, dispose, installed, presets, runs, runtime, secrets, servers, sessionFiles, sessions, templates };
};

export { createAppServices };
