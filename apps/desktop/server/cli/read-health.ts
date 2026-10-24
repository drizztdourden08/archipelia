/* @layer server @kind logic */
import { runServer } from '@drizztdourden08/brock-electron/server';
import type { Health } from './health.type';

const readHealth = async (dataDir: string): Promise<Health> => {
  let text = '';
  let code = 1;
  await runServer(() => ({ stop: () => undefined }), {
    argv: ['health', `--user-data=${dataDir}`],
    stdout: { write: (chunk: string) => { text += chunk; return true; } },
    setExitCode: (value) => { code = value; },
  });
  return { healthy: code === 0, text: text.trim() };
};

export { readHealth };
