/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { createPresetStore } from '@archipelia/presets';
import { createRunStore, createSessionService, createTemplateStore } from '@archipelia/sessions';
import { getSecrets } from '@drizztdourden08/brock-secrets/main';
import { listInstalled } from '@archipelia/catalog';
import type { GameSchema } from '@archipelia/model';
import { createServerStore } from './server-store';
import { createCatalogService } from './catalog-service';
import { loadRuntime } from './load-runtime';
import { createHostFactory } from './host-factory';

const createAppServices = (ctx: MainContext) => {
  const { files } = ctx;
  const presets = createPresetStore(files);
  const templates = createTemplateStore(files);
  const runs = createRunStore(files);
  const servers = createServerStore(files);
  const catalog = createCatalogService(ctx);
  const secrets = getSecrets(ctx);
  const runtime = () => loadRuntime(ctx);
  const installed = () => listInstalled(files);
  const schemaOf = async (game: string): Promise<GameSchema | undefined> =>
    (await installed()).find((record) => record.game === game)?.schema;
  const sessions = createSessionService({
    files, presets, runs, runtime, schemaOf,
    dataRoot: ctx.paths.data(),
    hostFor: createHostFactory({ ctx, runtime, secrets, servers }),
    resolveSecret: (ref) => secrets.get(ref),
    emit: (event) => ctx.emit('ap:sessions:event', event),
  });
  return { catalog, installed, presets, runs, runtime, secrets, servers, sessions, templates };
};

export { createAppServices };
