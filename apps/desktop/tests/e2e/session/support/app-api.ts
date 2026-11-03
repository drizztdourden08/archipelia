/* @layer tests @kind helper */
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { roomPasswordOf } from '../../app/support/room-password';
import type { LobbyTarget, RoomTarget } from './rotp-args';
import { LOBBY_SERVER, LOOPBACK, TIMEOUT } from './session-constants';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const field = (value: unknown, key: string): unknown => (isRecord(value) ? value[key] : undefined);

const apiCall = (launched: LaunchedApp, method: string, ...params: unknown[]): Promise<unknown> =>
  launched.page.evaluate(({ name, args }) => {
    const api: unknown = Reflect.get(window, 'api');
    const fn: unknown = typeof api === 'object' && api !== null ? Reflect.get(api, name) : undefined;
    if (typeof fn !== 'function') throw new Error(`window.api has no ${name}`);
    return Promise.resolve(Reflect.apply(fn, api, args));
  }, { name: method, args: params });

const pause = (ms: number) => new Promise<void>((resolve) => { setTimeout(resolve, ms); });

const lobbyNamed = async (launched: LaunchedApp, name: string, until = Date.now() + TIMEOUT.line): Promise<unknown> => {
  const lobbies = await apiCall(launched, 'lobbyList', LOBBY_SERVER);
  const found: unknown = Array.isArray(lobbies) ? lobbies.find((entry) => field(entry, 'name') === name) : undefined;
  if (found !== undefined) return found;
  if (Date.now() > until) throw new Error(`no lobby named ${name} on the lobby server`);
  await pause(500);
  return lobbyNamed(launched, name, until);
};

const lobbyTargetOf = async (launched: LaunchedApp, name: string): Promise<LobbyTarget> => {
  const lobby = await lobbyNamed(launched, name);
  const code = field(lobby, 'code');
  const port = field(await apiCall(launched, 'lobbyServerStatus'), 'port');
  if (typeof code !== 'string' || typeof port !== 'number') throw new Error(`the lobby of ${name} has no code or the lobby server has no port`);
  return { host: LOOPBACK, port, code: formatLobbyCode(code) ?? code };
};

const roomTargetOf = async (launched: LaunchedApp, name: string, slot: string): Promise<RoomTarget> => {
  const runs = await apiCall(launched, 'sessionsList');
  const hosting: unknown = Array.isArray(runs) ? runs.find((entry) => field(entry, 'status') === 'hosting' && field(field(entry, 'snapshot'), 'name') === name) : undefined;
  const endpoint = field(hosting, 'endpoint');
  const port = field(endpoint, 'port');
  const host = field(endpoint, 'host');
  if (typeof port !== 'number') throw new Error(`the hosting room of ${name} has no port`);
  return { host: typeof host === 'string' && host ? host : LOOPBACK, port, slot, password: await roomPasswordOf(launched, name) };
};

export { lobbyTargetOf, roomTargetOf };
