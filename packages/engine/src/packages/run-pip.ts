/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import type { InstallPackagesOptions } from './install-packages.type';
import { pipReason } from './pip-reason';
import { runPython } from '../process/run-python';

const runPip = async (runtime: EngineRuntime, args: string[], dir: string, { signal, run = runPython }: InstallPackagesOptions = {}) => {
  const { code, lines } = await run(runtime, { args: ['-I', '-m', 'pip', ...args], cwd: dir, signal });
  if (code !== 0) throw new Error(pipReason(lines, code));
  return lines;
};

export { runPip };
