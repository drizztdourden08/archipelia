/* @layer core @kind logic */
import type { GgClientOptions, LogChunk, RoomStatus } from './archipelago-gg.type';
import { cookieHeader } from './cookie-header';
import { readSessionCookie } from './read-session-cookie';

const lastSegment = (location: string | null, prefix: string) => {
  const segment = location ? new URL(location, 'http://x').pathname.match(new RegExp(`^/${prefix}/([^/]+)`))?.[1] : undefined;
  if (!segment) throw new Error(`archipelago.gg: expected a redirect to /${prefix}/, got ${location}`);
  return segment;
};

const createGgClient = ({ baseUrl = 'https://archipelago.gg', ownerId, fetch: request = fetch }: GgClientOptions) => {
  let cookie: string | undefined;

  const call = async (path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    headers.set('user-agent', 'Archipelia');
    cookieHeader(cookie).forEach(([name, value]) => headers.set(name, value));
    const res = await request(new URL(path, baseUrl), { ...init, redirect: 'manual', headers });
    cookie = readSessionCookie(res) ?? cookie;
    if (res.status >= 400) throw new Error(`archipelago.gg ${init.method ?? 'GET'} ${path}: HTTP ${res.status}`);
    return res;
  };

  const adoptOwner = async () => { await call(`/session/${ownerId}`); };

  const upload = async (zip: Uint8Array<ArrayBuffer>, fileName: string) => {
    const form = new FormData();
    form.append('file', new Blob([zip], { type: 'application/zip' }), fileName);
    return lastSegment((await call('/uploads', { method: 'POST', body: form })).headers.get('location'), 'seed');
  };

  const newRoom = async (seed: string) =>
    lastSegment((await call(`/new_room/${seed}`)).headers.get('location'), 'room');

  const roomStatus = async (room: string) => (await (await call(`/api/room_status/${room}`)).json()) as RoomStatus;

  const touch = async (room: string) => { await (await call(`/room/${room}?update`)).arrayBuffer(); };

  const waitForPort = async (room: string, signal: AbortSignal, everyMs = 2000) => {
    await touch(room);
    for (;;) {
      signal.throwIfAborted();
      const status = await roomStatus(room);
      if (status.last_port > 0) return status;
      if (status.last_port < 0) throw new Error(`archipelago.gg: room ${room} failed to start`);
      await new Promise((r) => setTimeout(r, everyMs));
    }
  };

  const command = async (room: string, cmd: string) => {
    await call(`/room/${room}`, { method: 'POST', body: new URLSearchParams({ cmd }) });
  };

  const log = async (room: string, offset = 0): Promise<LogChunk> => {
    const res = await call(`/log/${room}`, { headers: offset ? { range: `bytes=${offset}-` } : {} });
    const bytes = new Uint8Array(await res.arrayBuffer());
    return { text: new TextDecoder().decode(bytes), offset: offset + bytes.length };
  };

  return { adoptOwner, command, log, newRoom, roomStatus, touch, upload, waitForPort };
};

export { createGgClient };
