/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import type { InstallPackagesOptions } from '../packages/install-packages.type';
import { pipReason } from '../packages/pip-reason';
import { runPython } from '../process/run-python';
import type { WheelOrigin } from './wheel.type';
import { ORIGINS, ORIGIN_SCRIPT } from './wheel.constants';

const wheelOrigin = async (runtime: EngineRuntime, name: string, dir: string, { signal, run = runPython }: InstallPackagesOptions = {}): Promise<WheelOrigin> => {
  const { code, lines } = await run(runtime, { args: ['-I', '-c', ORIGIN_SCRIPT, name], cwd: dir, signal });
  if (code !== 0) throw new Error(`The engine Python did not say if ${name} is installed: ${pipReason(lines, code)}`);
  const answer = lines.filter((line) => line.trim() !== '').at(-1)?.trim();
  const origin = ORIGINS.find((known) => known === answer);
  if (origin === undefined) throw new Error(`The engine Python gave an answer about ${name} that Archipelia cannot read`);
  return origin;
};

export { wheelOrigin };
