/* @layer core @kind logic */
import { dirname, isAbsolute, relative } from 'node:path';
import type { EngineRuntime } from '@archipelia/model';

const pythonHome = (engine: EngineRuntime): string => {
  const home = dirname(dirname(engine.python));
  const inside = relative(engine.root, home);
  if (inside.startsWith('..') || isAbsolute(inside)) throw new Error(`The engine Python ${engine.python} is outside the engine folder ${engine.root}, so this server will not run an unlisted world with it.`);
  return home;
};

export { pythonHome };
