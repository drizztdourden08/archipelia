/* @layer server @kind logic */
import type { Core } from '@archipelia/server';
import type { ServerLog } from '@drizztdourden08/brock-electron/server';
import type { ServerConfig } from '../config/server-config.type';
import { engineChoice } from './engine-choice';

const installDefault = async (core: Core, log: ServerLog): Promise<void> => {
  log('no engine yet, installing the default one');
  const done = await core.engine.setup();
  if (done.state === 'ready') log(`engine ready: Archipelago ${done.apVersion ?? ''}`);
  else log(`the default engine did not install: ${done.error ?? 'unknown error'}`, 'error');
};

const installWanted = async (core: Core, wanted: ServerConfig['engine'], log: ServerLog): Promise<void> => {
  log(`installing Archipelago ${wanted.version}`);
  const result = await core.engine.install(await engineChoice(core, wanted.version, wanted.python));
  if (result.outcome === 'failed') log(`Archipelago ${wanted.version} did not install: ${result.error ?? 'unknown error'}`, 'error');
  else log(`engine ready: Archipelago ${wanted.version} (${result.outcome})`);
};

const ensureEngine = async (core: Core, wanted: ServerConfig['engine'], log: ServerLog): Promise<void> => {
  const status = await core.engine.status();
  if (!wanted.auto) {
    log(status.state === 'ready' ? 'engine.auto is off: the installed engine stays as it is' : 'no engine yet, and engine.auto is off: install one with engine install');
    return;
  }
  const current = status.state === 'ready' ? status.apVersion : undefined;
  if (current !== undefined && (wanted.version === '' || wanted.version === current)) log(`engine ready: Archipelago ${current}`);
  else if (wanted.version === '') await installDefault(core, log);
  else await installWanted(core, wanted, log);
};

export { ensureEngine };
