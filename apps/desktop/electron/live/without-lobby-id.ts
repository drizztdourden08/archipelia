/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';

const withoutLobbyId = (template: SessionTemplate): SessionTemplate => {
  const { lobby, ...rest } = template;
  return lobby ? { ...rest, lobby: { serverId: lobby.serverId } } : rest;
};

export { withoutLobbyId };
