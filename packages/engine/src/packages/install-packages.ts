/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { InstallPackagesOptions } from './install-packages.type';
import { PIP_ERROR, PIP_FLAGS } from './install-packages.constants';
import { runPython } from '../process/run-python';
import { apRoot } from '../runtime/ap-root';

const reasonOf = (lines: string[], code: number) => {
  const errors = lines.filter((line) => PIP_ERROR.test(line));
  const last = (errors.at(-1) ?? lines.filter((line) => line.trim() !== '').at(-1))?.replace(PIP_ERROR, '').trim();
  return last === undefined || last === '' ? `pip exited ${code}` : last;
};

const installPackages = async (runtime: EngineRuntime, packages: string[], { signal, run = runPython }: InstallPackagesOptions = {}): Promise<void> => {
  if (packages.length === 0) return;
  const dir = await mkdtemp(join(tmpdir(), 'archipelia-packages-'));
  try {
    const cwd = apRoot(runtime);
    const frozen = await run(runtime, { args: ['-m', 'pip', 'list', '--format=freeze', '--isolated', '--disable-pip-version-check'], cwd, signal });
    if (frozen.code !== 0) throw new Error(reasonOf(frozen.lines, frozen.code));
    const [constraints, requirements] = [join(dir, 'constraints.txt'), join(dir, 'requirements.txt')];
    await writeFile(constraints, frozen.lines.filter((line) => line.includes('==')).join('\n'), 'utf8');
    await writeFile(requirements, packages.join('\n'), 'utf8');
    const install = await run(runtime, { args: ['-m', 'pip', 'install', ...PIP_FLAGS, '-c', constraints, '-r', requirements], cwd, signal });
    if (install.code !== 0) throw new Error(reasonOf(install.lines, install.code));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

export { installPackages };
