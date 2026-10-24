/* @layer electron-main @kind logic */
import type { EngineChoice, EngineStatus } from '@archipelia/model';
import { createInstallDeps } from './create-install-deps';
import { createRemoveDeps } from './create-remove-deps';
import { createEngineLock } from './engine-lock';
import { createEngineReads } from './engine-reads';
import { createEngineRuntimes } from './engine-runtimes';
import type { EngineEnv } from './engine-service.type';
import { ENGINE_TEXT } from './engine-text.constants';
import { installEngine } from './install-engine';
import { isEngineChoice } from './is-engine-choice';
import { OUTCOME_EVENT } from './outcome-event.constants';
import { removeEngine } from './remove-engine';
import { runSwitchJob } from './run-switch-job';
import { setupEngine } from './setup-engine';
import { createVersionSource } from './version-source';

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
