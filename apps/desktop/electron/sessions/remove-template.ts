/* @layer electron-main @kind logic */
import type { PendingClose } from '../../src/lobbies/lobbies.type';
import type { TemplateStore } from './sessions.type';

const removeTemplate = async (id: string, store: TemplateStore, close: (ref: PendingClose) => Promise<unknown>) => {
  const direct = (await store.get(id))?.direct;
  if (direct?.lobbyId) await close({ templateId: id, serverId: direct.serverId, lobbyId: direct.lobbyId });
  await store.remove(id);
};

export { removeTemplate };
