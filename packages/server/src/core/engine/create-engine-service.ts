/* @layer core @kind logic */
import {
  createEngineLock, createEngineRuntimes, createRemoveDeps, createVersionSource, ENGINE_TEXT, installEngine, isEngineChoice, OUTCOME_EVENT,
  removeEngine, runSwitchJob, setupEngine,
} from '@archipelia/engine/install';
import type { EngineEnv } from '@archipelia/engine/install';
import type { EngineChoice, EngineStatus } from '@archipelia/model';
import { createInstallDeps } from './create-install-deps';
import { createEngineReads } from './engine-reads';

const createEngineService = (env: EngineEnv) => {
  const source = createVersionSource(env);
  const deps = createInstallDeps(env, source);
  const lock = createEngineLock();
  const reads = createEngineReads(env, source, () => lock.current() === 'install');
  let setting: Promise<EngineStatus> | undefined;

  const install = (choice: EngineChoice) => lock.run('install', async () => {
    if (!isEngineChoice(choice)) throw new Error(ENGINE_TEXT.badChoice);
    const result = await installEngine(deps, choice);
    const kind = OUTCOME_EVENT[result.outcome];
    if (kind && result.id) await reads.announce(kind, result.id);
    return result;
  });

  const switchTo = (id: string) => lock.run('switch', async () => {
    await runSwitchJob(env.startJob, deps, id);
    await reads.announce('switched', id);
    return reads.overview();
  });

  const remove = (id: string) => lock.run('remove', async () => {
    await removeEngine(createRemoveDeps(env, deps.discard), id);
    await reads.announce('removed', id);
    return reads.overview();
  });

  const setup = () => {
    setting ??= setupEngine({ root: env.root, target: env.target, install, status: reads.status }).finally(() => { setting = undefined; });
    return setting;
  };

  return { ...createEngineRuntimes(env.root, env.target), ...reads, install, remove, setup, switchTo };
};

export { createEngineService };
