/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { spawn } from 'node:child_process';
import type { PythonSpawn } from './spawn-python.type';
import { engineEnv } from '../runtime/engine-env';
import { splitLines } from './split-lines';

const spawnPython = (runtime: EngineRuntime, { args, cwd, onLine, keepStdin = false, signal }: PythonSpawn) => {
  const child = spawn(runtime.python, ['-X', 'utf8', ...args], {
    cwd, env: engineEnv(), stdio: [keepStdin ? 'pipe' : 'ignore', 'pipe', 'pipe'], windowsHide: true, signal,
  });
  const take = (line: string) => onLine?.(line);
  child.stdout?.on('data', splitLines(take));
  child.stderr?.on('data', splitLines(take));
  return child;
};

export { spawnPython };
