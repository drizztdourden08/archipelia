/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { LobbyStore } from '../lobby-service.type';
import { createQueue } from './create-queue';
import { recoverLobby } from './recover-lobby';
import { storeFault } from './store-fault';

const createLobbyBook = (store: LobbyStore, now: () => number) => {
  const lobbies = new Map<string, Lobby>();
  let loaded: Promise<void> | undefined;

  const save = (lobby: Lobby) => store.save(lobby).catch((error: unknown) => {
    throw storeFault(error);
  });

  const load = async () => {
    for (const stored of await store.load()) {
      const recovered = recoverLobby(stored, now());
      if (recovered) await save(recovered);
      lobbies.set(stored.id, recovered ?? stored);
    }
  };

  const ready = () => {
    loaded ??= load();
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

  const byCode = async (code: string) => {
    const all = (await list()).filter((lobby) => lobby.code === code);
    return all.find((lobby) => lobby.phase !== 'closed') ?? all[0];
  };

  const add = async (lobby: Lobby) => {
    await ready();
    await save(lobby);
    lobbies.set(lobby.id, lobby);
    return lobby;
  };

  const write = async (id: string, change: (draft: Lobby) => void | Promise<void>) => {
    const current = await get(id);
    if (!current) throw new Error(`no lobby has the id ${id}`);
    const draft = structuredClone(current);
    await change(draft);
    draft.rev = current.rev + 1;
    await save(draft);
    lobbies.set(id, draft);
    return draft;
  };

  const queue = createQueue();
  const commit = (id: string, change: (draft: Lobby) => void | Promise<void>): Promise<Lobby> => queue(id, () => write(id, change));

  return { add, byCode, commit, get, list };
};

export { createLobbyBook };
