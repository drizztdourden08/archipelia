/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { LobbyStore } from '../lobby-service.type';
import { createQueue } from './create-queue';

const createLobbyBook = (store: LobbyStore) => {
  const lobbies = new Map<string, Lobby>();
  let loaded: Promise<void> | undefined;

  const ready = () => {
    loaded ??= store.load().then((all) => {
      for (const lobby of all) lobbies.set(lobby.id, lobby);
    });
    return loaded;
  };

  const get = async (id: string) => {
    await ready();
    return lobbies.get(id);
  };

  const list = async () => {
    await ready();
    return [...lobbies.values()];
  };

  const byCode = async (code: string) => (await list()).find((lobby) => lobby.code === code);

  const add = async (lobby: Lobby) => {
    await ready();
    await store.save(lobby);
    lobbies.set(lobby.id, lobby);
    return lobby;
  };

  const write = async (id: string, change: (draft: Lobby) => void | Promise<void>) => {
    const current = await get(id);
    if (!current) throw new Error(`no lobby has the id ${id}`);
    const draft = structuredClone(current);
    await change(draft);
    draft.rev = current.rev + 1;
    await store.save(draft);
    lobbies.set(id, draft);
    return draft;
  };

  const queue = createQueue();
  const commit = (id: string, change: (draft: Lobby) => void | Promise<void>): Promise<Lobby> => queue(id, () => write(id, change));

  return { add, byCode, commit, get, list };
};

export { createLobbyBook };
