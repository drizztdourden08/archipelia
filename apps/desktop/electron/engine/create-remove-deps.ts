/* @layer electron-main @kind logic */
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { DOWNLOADS_DIR, forgetEngine, readEngineState } from '@archipelia/engine';
import type { EngineEnv } from './engine-service.type';
import type { RemoveDeps } from './remove-engine.type';

const createRemoveDeps = (env: EngineEnv, discard: (id: string) => Promise<void>): RemoveDeps => {
  const downloads = join(env.root, DOWNLOADS_DIR);
  return {
    state: () => readEngineState(env.root),
    inUse: env.inUse,
    forget: async (id) => { await forgetEngine(env.root, id); },
    discard,
    downloads: () => readdir(downloads).catch((): string[] => []),
    dropDownload: (name) => rm(join(downloads, name), { force: true }),
  };
};

export { createRemoveDeps };
