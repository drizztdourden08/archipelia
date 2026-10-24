/* @layer electron-main @kind logic */
import { ENGINE_DIR_ENV } from '@archipelia/engine';
import { ENGINE_TEXT } from './engine-text.constants';

const createEngineLock = () => {
  let running: { kind: string; work: Promise<unknown> } | undefined;

  const run = <T>(kind: string, work: () => Promise<T>): Promise<T> => {
    if (process.env[ENGINE_DIR_ENV]) return Promise.reject(new Error(ENGINE_TEXT.external));
    if (running) return Promise.reject(new Error(ENGINE_TEXT.busy));
    const started = work().finally(() => { running = undefined; });
    running = { kind, work: started };
    return started;
  };

  return { run, current: () => running?.kind };
};

export { createEngineLock };
