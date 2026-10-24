/* @layer tests @kind helper */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type { SpawnedServer } from './spawn-server.type';

const BUNDLE = fileURLToPath(new URL('../../../dist/server/main.mjs', import.meta.url));

const spawnServer = (dataDir: string): SpawnedServer => {
  const child = spawn(process.execPath, [BUNDLE, `--user-data=${dataDir}`, '--no-focus', '--muted'], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  const lines: string[] = [];
  const watchers: { pattern: RegExp; done: () => void }[] = [];
  const take = (chunk: Buffer) => {
    for (const line of chunk.toString('utf8').split(/\r?\n/).filter((entry) => entry !== '')) {
      lines.push(line);
      watchers.filter((watcher) => watcher.pattern.test(line)).forEach((watcher) => watcher.done());
    }
  };
  child.stdout.on('data', take);
  child.stderr.on('data', take);
  const exited = new Promise<number | null>((resolve) => child.once('exit', resolve));
  const waitFor = (pattern: RegExp, ms: number) => new Promise<void>((resolve, reject) => {
    if (lines.some((line) => pattern.test(line))) {
      resolve();
      return;
    }
    const timer = setTimeout(() => reject(new Error(`no log line matched ${String(pattern)} in ${ms} ms:\n${lines.join('\n')}`)), ms);
    watchers.push({ pattern, done: () => { clearTimeout(timer); resolve(); } });
    void exited.then((code) => reject(new Error(`the server exited with ${String(code)}:\n${lines.join('\n')}`)));
  });
  const stop = async () => {
    child.kill('SIGTERM');
    await exited;
  };
  return { lines, waitFor, stop };
};

export { spawnServer };
