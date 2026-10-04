/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { lanAddresses } from '@drizztdourden08/brock-electron/main';
import { getSecrets } from '@drizztdourden08/brock-secrets/main';
import { createCatalogService, listInstalled } from '@archipelia/catalog';
import { loadRuntime } from '@archipelia/engine';
import { createHostFactory, GG_OWNER_SECRET } from '@archipelia/hosts';
import type { GameSchema } from '@archipelia/model';
import { createPresetStore } from '@archipelia/presets';
import { createRunStore, createServerStore, createSessionService, createTemplateStore } from '@archipelia/sessions';
import { engineDirOf } from '../engine/engine-dir-of';

const advertiseHost = () => lanAddresses().find((lan) => lan.family === 'IPv4')?.address ?? '127.0.0.1';

const createAppServices = (ctx: MainContext) => {
  const { files } = ctx;
  const engineDir = () => engineDirOf(ctx);
  const presets = createPresetStore(files);
  const templates = createTemplateStore(files);
  const runs = createRunStore(files);
  const servers = createServerStore(files);
  const catalog = createCatalogService({ files, engineDir });
  const secrets = getSecrets(ctx);
  const runtime = () => loadRuntime(engineDir());
  const installed = () => listInstalled(files);
  const schemaOf = async (game: string): Promise<GameSchema | undefined> =>
    (await installed()).find((record) => record.game === game)?.schema;
  const sessions = createSessionService({
    files, presets, runs, runtime, schemaOf,
    dataRoot: ctx.paths.data(),
    hostFor: createHostFactory({ runtime, secrets, servers, advertiseHost, ggOwnerSecret: GG_OWNER_SECRET }),
    resolveSecret: (ref) => secrets.get(ref),
    emit: (event) => ctx.emit('ap:sessions:event', event),
  });
  return { catalog, installed, presets, runs, runtime, secrets, servers, sessions, templates };
};

export { createAppServices };
