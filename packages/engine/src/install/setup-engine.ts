/* @layer core @kind logic */
import { findActiveEngine, readEngineState } from '../index';
import type { EngineChoice, EngineInstallResult, EngineStatus } from '@archipelia/model';
import { defaultChoice } from './default-choice';
import { ENGINE_TEXT } from './engine-text.constants';
import type { SetupDeps } from './setup-engine.type';

const choiceToSet = async ({ root, target }: SetupDeps): Promise<EngineChoice | undefined> => {
  const active = findActiveEngine(await readEngineState(root));
  return active ? { ap: active.ap, python: active.python, pythonRelease: active.pythonRelease } : defaultChoice(target);
};

const setupEngine = async (deps: SetupDeps): Promise<EngineStatus> => {
  try {
    const choice = await choiceToSet(deps);
    const result: EngineInstallResult = choice ? await deps.install(choice) : { outcome: 'failed', error: `No tested Python for ${deps.target}` };
    const current = await deps.status();
    if (result.outcome !== 'failed') return current;
    return { ...current, ...(current.state === 'ready' ? {} : { state: 'failed' as const }), error: result.error ?? ENGINE_TEXT.notSetUp };
  } catch (err) {
    return { ...(await deps.status()), error: (err as Error).message };
  }
};

export { setupEngine };
