/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { InstallPackagesOptions } from './install-packages.type';
import { PIP_FLAGS } from './install-packages.constants';
import { readPipReport } from './read-pip-report';
import type { ResolvedPackage } from './resolved-package.type';
import { runPip } from './run-pip';
import { withPipDir } from './with-pip-dir';
import { writeConstraints } from './write-constraints';

const resolvePackages = (runtime: EngineRuntime, specs: string[], options: InstallPackagesOptions = {}): Promise<ResolvedPackage[]> => {
  if (specs.length === 0) return Promise.resolve([]);
  return withPipDir(async (dir) => {
    const constraints = await writeConstraints(runtime, dir, options);
    const [requirements, report] = [join(dir, 'requirements.txt'), join(dir, 'report.json')];
    await writeFile(requirements, specs.join('\n'), 'utf8');
    await runPip(runtime, ['install', ...PIP_FLAGS, '--dry-run', '--report', report, '-c', constraints, '-r', requirements], dir, options);
    return readPipReport(await readFile(report, 'utf8'));
  });
};

export { resolvePackages };
