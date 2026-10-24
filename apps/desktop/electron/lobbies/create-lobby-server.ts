/* @layer electron-main @kind logic */
import { serverIdentity } from '@archipelia/server';
import { DEFAULT_SERVER_OPTIONS, SERVER_OPTIONS_FILE } from '../../src/lobbies/lobbies.constants';
import type { LobbyServerOptions, LobbyServerStatus, ServerInfo } from '../../src/lobbies/lobbies.type';
import { createListenerCell } from './create-listener-cell';
import { createSerialQueue } from './create-serial-queue';
import { BAD_OPTIONS, PRODUCT_NAME } from './lobbies.constants';
import { parseServerOptions } from './parse-server-options';
import type { LobbyServerDeps } from './lobbies.type';
import { readServerOptions } from './read-server-options';

const createLobbyServer = (deps: LobbyServerDeps) => {
  const { files, automation, canStoreSecrets, lanHost, version } = deps;
  const cell = createListenerCell(deps);
  const enqueue = createSerialQueue();
  let options: LobbyServerOptions = DEFAULT_SERVER_OPTIONS;
  let serverId: string | undefined;

  const status = (): LobbyServerStatus => {
    const endpoint = cell.endpoint();
    const error = cell.failure();
    return {
      state: cell.state(),
      ...(error ? { error } : {}),
      options,
      automation,
      roomPasswords: canStoreSecrets() ? 'vault' : 'memory',
      lanAddress: lanHost(),
      ...(endpoint ? { port: endpoint.port, secure: endpoint.secure, reach: endpoint.reach() } : {}),
      ...(serverId ? { serverId } : {}),
    };
  };

  const info = (): ServerInfo => {
    const endpoint = cell.endpoint();
    return { name: PRODUCT_NAME, version, port: endpoint?.port ?? 0, sandbox: 'none', tls: endpoint?.secure ?? false };
  };

  const start = () => enqueue(async () => {
    serverId = (await serverIdentity(files)).id;
    options = await readServerOptions(files);
    await cell.open(options);
  });

  const apply = (given: unknown) => enqueue(async () => {
    const next = parseServerOptions(given);
    if (!next) throw new Error(BAD_OPTIONS);
    await cell.close();
    options = next;
    await files.writeJson(SERVER_OPTIONS_FILE, next);
    await cell.open(next);
    return status();
  });

  return { apply, info, start, status, stop: () => enqueue(cell.close) };
};

export { createLobbyServer };
