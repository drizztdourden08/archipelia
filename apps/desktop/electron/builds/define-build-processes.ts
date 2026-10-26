/* @layer electron-main @kind logic */
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import { BUILD_JOB } from '@archipelia/model';
import { parseBuildId } from '@archipelia/catalog';
import { BUILD_JOBS, BUILD_LABEL, BUILD_TIMEOUT_MS } from './builds.constants';
import type { createBuildLines } from './create-build-lines';
import type { SpecOf } from './define-build-processes.type';

const defineBuildProcesses = (processes: Pick<ProcessJobs, 'define'>, specOf: SpecOf, lines: ReturnType<typeof createBuildLines>): void => {
  for (const job of BUILD_JOBS) {
    const id = BUILD_JOB[job];
    processes.define(id, {
      label: BUILD_LABEL[job],
      timeoutMs: BUILD_TIMEOUT_MS[job],
      parse: (raw) => ({ buildId: parseBuildId(raw) }),
      resolve: (args) => specOf(job, args),
      progress: (line) => {
        lines.add(id, line);
        return undefined;
      },
    });
  }
};

export { defineBuildProcesses };
