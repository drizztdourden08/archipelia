/* @layer core @kind logic */
import type { ChildProcess } from 'node:child_process';
import type { Endpoint } from '@archipelia/model';
import { spawnPython } from '@archipelia/engine';
import { once } from 'node:events';
import { createLogHub } from './log-hub';
import type { LogHub } from './log-hub.type';
import { HOSTING } from './local-host.constants';
import type { LocalHostOptions } from './local-host.type';
import type { HostStart, SessionHost } from '../session-host.type';
import { removeSessionSettings } from './remove-session-settings';
import { writeSessionSettings } from './write-session-settings';
import { serverArgs } from './server-args';

const waitForHosting = (child: ChildProcess, hub: LogHub, advertiseHost: string) =>
  new Promise<Endpoint>((resolve, reject) => {
    const off = hub.subscribe(({ text }) => {
      const match = text.match(HOSTING);
      if (!match) return;
      off();
      resolve({ host: advertiseHost, port: Number(match[1]) });
    });
    child.once('exit', (code) => reject(new Error(`MultiServer exited with code ${code} before hosting`)));
    child.once('error', reject);
  });

const createLocalHost = ({ runtime, port, bindHost = '0.0.0.0', advertiseHost, stopTimeoutMs = 10000 }: LocalHostOptions): SessionHost => {
  const hub = createLogHub();
  let child: ChildProcess | undefined;

  const start = async ({ sessionDir, seedFile, server, password, signal }: HostStart) => {
    if (child) throw new Error('this host is already running');
    await writeSessionSettings(sessionDir, password);
    const args = [runtime.multiServer, seedFile, ...serverArgs(server, port, bindHost)];
    child = spawnPython(runtime, { args, cwd: sessionDir, onLine: hub.push, keepStdin: true, signal });
    try {
      return await waitForHosting(child, hub, advertiseHost);
    } finally {
      await removeSessionSettings(sessionDir);
    }
  };

  const command = (cmd: string) => {
    if (!child?.stdin?.writable) return Promise.reject(new Error('the server is not running'));
    child.stdin.write(`${cmd}\n`);
    return Promise.resolve();
  };

  const stop = async () => {
    const running = child;
    if (running?.exitCode !== null) return;
    const exited = once(running, 'exit');
    running.stdin?.write('/exit\n');
    const timer = setTimeout(() => running.kill(), stopTimeoutMs);
    await exited;
    clearTimeout(timer);
    child = undefined;
  };

  return { kind: 'local', start, command, onLog: hub.subscribe, stop };
};

export { createLocalHost };
