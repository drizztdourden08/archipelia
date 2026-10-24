/* @layer tests @kind helper */
import { runServer } from '@drizztdourden08/brock-electron/server';
import { createNodeDomains } from '@archipelia/server/node';
import { startServer } from '../../../server/start/start-server';

const runStarted = async (dataDir: string) => {
  const lines: string[] = [];
  const sink = { write: (chunk: string) => { lines.push(chunk.trim()); return true; } };
  const handle = await runServer(startServer, {
    domains: createNodeDomains, argv: [`--user-data=${dataDir}`], env: {}, stdout: sink, stderr: sink, heartbeatMs: 60000,
    signals: { once: () => undefined }, setExitCode: () => undefined,
  });
  if (!handle) throw new Error(`the server did not start: ${lines.join('\n')}`);
  return { stop: handle.stop, lines };
};

export { runStarted };
