/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { spawn } from 'node:child_process';
import type { SpawnCommand } from './spawn-command.type';
import type { PythonSpawn } from './spawn-python.type';
import { engineEnv } from '../runtime/engine-env';
import { splitLines } from './split-lines';

const spawnPython = (runtime: EngineRuntime, { args, cwd, onLine, keepStdin = false, signal, wrap }: PythonSpawn) => {
  const plain: SpawnCommand = { file: runtime.python, args: ['-X', 'utf8', ...args], cwd, env: engineEnv() };
  const command = wrap ? wrap(plain) : plain;
  const child = spawn(command.file, command.args, {
    cwd: command.cwd, env: command.env, stdio: [keepStdin ? 'pipe' : 'ignore', 'pipe', 'pipe'], windowsHide: true, signal,
  });
  const take = (line: string) => onLine?.(line);
  child.stdout?.on('data', splitLines(take));
  child.stderr?.on('data', splitLines(take));
  return child;
};

export { spawnPython };
