/* @layer core @kind logic */
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import type { Endpoint } from '@archipelia/model';
import type { GgHostOptions } from './gg-host.type';
import type { HostStart, SessionHost } from '../session-host.type';
import { DEFAULT_BASE } from './gg-host.constants';
import { createGgClient } from '../archipelago-gg/client';
import { createRedactingHub } from './redacting-hub';
import { createLogPoller } from './log-poller';
import type { LogPoller } from './log-poller.type';
import { assertUploadSize } from './upload-limit';
import { PASSWORD_SET } from './room-password.constants';
import { passwordCommand } from './room-password';
import { waitForRoomStop } from './room-stopped';
import { waitForLine } from './wait-for-line';

const createGgHost = (options: GgHostOptions): SessionHost => {
  const { ownerId, baseUrl = DEFAULT_BASE, pollMs = 2000, passwordTimeoutMs = 20000, stopTimeoutMs = 15000, fetch: request } = options;
  const client = createGgClient({ baseUrl, ownerId, fetch: request });
  const hub = createRedactingHub();
  let room: string | undefined;
  let poller: LogPoller | undefined;

  const openRoom = async (seedFile: string, password?: string) => {
    const zip = await readFile(seedFile);
    assertUploadSize(zip.byteLength);
    const setPassword = password ? passwordCommand(password) : undefined;
    await client.adoptOwner();
    const seed = await client.upload(zip, basename(seedFile));
    const opened = await client.newRoom(seed);
    if (setPassword) await client.command(opened, setPassword).catch(async (error: unknown) => {
      await client.command(opened, '/exit').catch(() => undefined);
      throw error;
    });
    return opened;
  };

  const halt = async (target: string) => {
    await client.command(target, '/exit');
    const stopped = await waitForRoomStop(client, target, pollMs, stopTimeoutMs);
    await poller?.drain();
    if (!stopped) hub.push(`archipelago.gg did not confirm the room stopped within ${stopTimeoutMs} ms`);
  };

  const start = async ({ seedFile, password, signal }: HostStart): Promise<Endpoint> => {
    if (room) throw new Error('this host is already running');
    const since = Date.now();
    room = await openRoom(seedFile, password);
    const opened = room;
    poller = createLogPoller({ client, room: opened, everyMs: pollMs, onLine: hub.push });
    try {
      const status = await client.waitForPort(opened, signal ?? new AbortController().signal, pollMs);
      if (password) await waitForLine(hub, { pattern: PASSWORD_SET, timeoutMs: passwordTimeoutMs, what: 'the room to confirm its password', since });
      return { host: new URL(baseUrl).hostname, port: status.last_port, roomUrl: `${baseUrl}/room/${opened}` };
    } catch (error) {
      await halt(opened).catch(() => undefined);
      poller.stop();
      room = undefined;
      throw error;
    }
  };

  const command = async (cmd: string) => {
    if (!room) throw new Error('the room is not running');
    if (/[\r\n]/.test(cmd)) throw new Error('a command cannot contain a line break');
    await client.command(room, cmd);
  };

  const stop = async () => {
    const target = room;
    if (!target) return;
    try {
      await halt(target);
    } finally {
      poller?.stop();
      poller = undefined;
      room = undefined;
    }
  };

  return { kind: 'archipelago-gg', start, command, onLog: hub.subscribe, stop };
};

export { createGgHost };
