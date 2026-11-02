/* @layer tests @kind helper */
import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROTP_COMMAND } from './session-constants';

const POLL_MS = 500;
const STOP_GRACE_MS = 10000;

type RotpInstance = {
  name: string;
  startedAt: number;
  child: ChildProcess;
  eventLog: string;
  output: () => string;
  exited: () => boolean;
};

type RotpStart = { name: string; cwd: string; args: (eventLog: string) => string[]; outDir: string };

const pause = (ms: number) => new Promise<void>((resolve) => { setTimeout(resolve, ms); });

const startRotp = async ({ name, cwd, args, outDir }: RotpStart): Promise<RotpInstance> => {
  await mkdir(outDir, { recursive: true });
  const sink = createWriteStream(join(outDir, `${name}.log`));
  const chunks: string[] = [];
  const keep = (chunk: Buffer) => {
    chunks.push(String(chunk));
    sink.write(chunk);
  };
  const childEnv = { ...process.env };
  delete childEnv.ELECTRON_RUN_AS_NODE;
  const eventLog = join(outDir, `${name}.events.jsonl`);
  const windows = process.platform === 'win32';
  const startedAt = Date.now();
  const child = spawn(ROTP_COMMAND, args(eventLog), { cwd, windowsHide: true, shell: windows, detached: !windows, stdio: ['ignore', 'pipe', 'pipe'], env: childEnv });
  const state = { exited: false };
  child.stdout.on('data', keep);
  child.stderr.on('data', keep);
  child.on('error', (error) => { chunks.push(`spawn error: ${error.message}\n`); state.exited = true; });
  child.on('exit', (code) => { chunks.push(`exited with code ${String(code)}\n`); state.exited = true; sink.end(); });
  return { name, startedAt, child, eventLog, output: () => chunks.join(''), exited: () => state.exited };
};

const eventsOf = async (path: string): Promise<Record<string, unknown>[]> => {
  try {
    const lines = (await readFile(path, 'utf8')).split(/\r?\n/).filter((line) => line.trim() !== '');
    return lines.flatMap((line) => {
      try {
        const parsed: unknown = JSON.parse(line);
        return typeof parsed === 'object' && parsed !== null ? [Object.fromEntries(Object.entries(parsed))] : [];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
};

const ownItemSeen = (events: Record<string, unknown>[]) => {
  const connected = events.findIndex((entry) => entry.t === 'connected');
  return connected >= 0 && events.slice(connected + 1).some((entry) => entry.t === 'item-received' && entry.self === true);
};

const waitForChestItem = async (instance: RotpInstance, timeoutMs: number, until = Date.now() + timeoutMs): Promise<void> => {
  if (ownItemSeen(await eventsOf(instance.eventLog))) return;
  if (instance.exited()) throw new Error(`${instance.name} ended before its own chest item arrived. Its output ends: ${instance.output().slice(-2000)}`);
  if (Date.now() > until) throw new Error(`${instance.name} never got its own chest item (no item-received with self true after connected)`);
  await pause(POLL_MS);
  await waitForChestItem(instance, timeoutMs, until);
};

const signalGroup = (pid: number): boolean => {
  try {
    process.kill(-pid, 'SIGTERM');
    return true;
  } catch {
    return false;
  }
};

const killTree = (pid: number): Promise<void> => new Promise((resolve) => {
  if (process.platform !== 'win32') {
    signalGroup(pid);
    resolve();
    return;
  }
  const killer = spawn('taskkill', ['/PID', String(pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  killer.once('exit', () => resolve());
  killer.once('error', () => resolve());
});

const stopRotp = async (instance: RotpInstance) => {
  const { pid } = instance.child;
  if (instance.exited() || pid === undefined) return;
  const gone = new Promise<void>((resolve) => { instance.child.once('exit', () => resolve()); });
  await killTree(pid);
  await Promise.race([gone, pause(STOP_GRACE_MS)]);
};

export { eventsOf, startRotp, stopRotp, waitForChestItem };
export type { RotpInstance };
