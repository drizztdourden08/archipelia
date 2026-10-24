/* @layer renderer-app @kind logic */
import type { LobbyServerStatus } from './lobbies.type';

const lobbyAddress = (status: LobbyServerStatus | null): string | null => {
  if (status?.port === undefined) return null;
  const closed = status.automation || status.options.mode === 'off';
  return `${closed ? '127.0.0.1' : status.lanAddress}:${status.port}`;
};

export { lobbyAddress };
