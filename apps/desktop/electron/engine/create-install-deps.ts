/* @layer electron-main @kind logic */
import { rm } from 'node:fs/promises';
import { carryWorlds, guardRecords, installOfficial } from '@archipelia/catalog';
import {
  activateEngine, activeEngineDir, engineFolder, engineInstalled, findActiveEngine, loadEngineRuntime, loadRuntime, readEngineState,
  readInstalledEngine, registerEngine, stampEngineSmoke, verifyEngineSource,
} from '@archipelia/engine';
import { buildEngine } from '@archipelia/engine-bundle';
import { ENGINE_JOB } from '../../src/jobs/jobs.constants';
import type { EngineEnv, VersionSource } from './engine-service.type';
import { ENGINE_JOB_TITLE, ENGINE_STEPS } from './engine-steps.constants';
import { fallbackChoice } from './fallback-choice';
import type { InstallDeps } from './install-engine.type';
import { resolveChoice } from './resolve-choice';
import { createSmokeDeps } from './smoke/create-smoke-deps';
import { runSmoke } from './smoke/run-smoke';

const createInstallDeps = (env: EngineEnv, source: VersionSource): InstallDeps => {
  const smoke = createSmokeDeps();
  const { root, games } = env;
  return {
    job: () => env.startJob(ENGINE_JOB, ENGINE_STEPS, { title: ENGINE_JOB_TITLE, cancellable: true }),
    resolve: async (choice) => resolveChoice(source, choice, await readEngineState(root)),
    wasBuilt: (id) => engineInstalled(engineFolder(root, id)),
    build: async (spec, hooks) => {
      await buildEngine({ buildDir: root, spec, verifySource: (apRoot) => verifyEngineSource(apRoot, spec), ...hooks });
    },
    runtimeOf: (id) => loadEngineRuntime(root, id),
    active: async () => {
      const dir = await activeEngineDir(root);
      return dir ? loadRuntime(dir).catch(() => undefined) : undefined;
    },
    guardRecords: () => guardRecords(games),
    carry: ({ from, to, since }) => carryWorlds({
      from, to, since, files: games, reinstall: (apworld) => installOfficial({ engineDir: to.root, files: games, apworld }),
    }),
    smoke: (input) => runSmoke(smoke, input),
    stamp: (id, result) => stampEngineSmoke(engineFolder(root, id), result),
    describe: (id) => readInstalledEngine(engineFolder(root, id)),
    register: async (engine) => { await registerEngine(root, engine); },
    activate: async (id) => { await activateEngine(root, id); },
    discard: (id) => rm(engineFolder(root, id), { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }),
    fallback: async (choice) => fallbackChoice(choice, findActiveEngine(await readEngineState(root)), env.target),
  };
};

export { createInstallDeps };
