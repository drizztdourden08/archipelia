/* @layer core @kind logic */
import { rm } from 'node:fs/promises';
import type { ActiveBuild, BuildSession } from './build.type';

const createBuildSession = (log: (message: string) => void): BuildSession => {
  let active: ActiveBuild | undefined;
  return {
    current: () => active,
    open: (build) => { active = build; },
    close: async () => {
      const done = active;
      active = undefined;
      if (!done) return;
      done.controller.abort();
      await rm(done.dirs.work, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 })
        .then(() => log('build: removed the temporary build folder'), () => log('build: could not remove the temporary build folder'));
    },
  };
};

export { createBuildSession };
