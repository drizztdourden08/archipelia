/* @layer electron-main @kind logic */
import type { PendingClose } from '../../src/lobbies/lobbies.type';
import type { TemplateStore } from './sessions.type';

const removeTemplate = async (id: string, store: TemplateStore, close: (ref: PendingClose) => Promise<unknown>) => {
  const lobby = (await store.get(id))?.lobby;
  if (lobby?.lobbyId) await close({ templateId: id, serverId: lobby.serverId, lobbyId: lobby.lobbyId });
  await store.remove(id);
};

export { removeTemplate };
