/* @layer electron-main @kind logic */
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { AppError } from '@drizztdourden08/brock-core/ipc';
import { BUILD_JOB, installFailureOf } from '@archipelia/model';
import { APP_CHANNELS } from '../../src/ipc/contract.constants';

const coded = (err: unknown): unknown => {
  const failure = installFailureOf(err);
  return failure ? new AppError(failure.message, { code: failure.code, data: { packages: failure.packages }, cause: err }) : err;
};

const gamesHandlers: HandlerGroup = {
  id: 'archipelia-games',
  register: (ctx) => {
    const { catalog, installed } = ctx.services;
    const wired = <T,>(work: Promise<T>) => work.catch((err: unknown) => { throw coded(err); });
    ctx.handle(APP_CHANNELS.catalogRead, (_event, refresh) => catalog.read(refresh));
    ctx.handle(APP_CHANNELS.catalogOfficial, () => catalog.official());
    ctx.handle(APP_CHANNELS.catalogEnrich, (_event, request) => catalog.enrich(request));
    ctx.handle(APP_CHANNELS.gamesList, () => installed());
    ctx.handle(APP_CHANNELS.gamesInstall, (_event, request) => wired(catalog.install(request)));
    ctx.handle(APP_CHANNELS.gamesPackages, (_event, request) => wired(catalog.packages(request)));
    ctx.handle(APP_CHANNELS.gamesRemove, (_event, apworld) => catalog.remove(apworld));
    ctx.handle(APP_CHANNELS.sourcesSuggest, (_event, request) => catalog.sources.suggest(request));
    ctx.handle(APP_CHANNELS.sourcesPlan, (_event, ref) => catalog.sources.plan(ref));
    ctx.handle(APP_CHANNELS.sourcesPypiPreview, (_event, ref) => catalog.sources.pypiPreview(ref));
    ctx.handle(APP_CHANNELS.sourcesPypiInstall, (_event, request) => catalog.sources.pypiInstall(request));
    ctx.handle(APP_CHANNELS.sourcesWheel, (_event, request) => catalog.sources.wheel(request));
    ctx.handle(APP_CHANNELS.sourcesBuildPrepare, (_event, request) => catalog.sources.buildPrepare(request));
    ctx.handle(APP_CHANNELS.sourcesBuildStart, (_event, request) => catalog.sources.buildStart(request));
    ctx.handle(APP_CHANNELS.sourcesBuildCancel, () => {
      catalog.sources.buildCancel();
      for (const id of Object.values(BUILD_JOB)) ctx.jobs.cancel(id);
      return Promise.resolve();
    });
  },
};

export { gamesHandlers };
