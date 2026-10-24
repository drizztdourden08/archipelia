/* @layer core @kind logic */
import type { DataFiles, Lobby } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import type { LobbyStore } from '../lobby-service.type';
import { FILES_DIR, LOBBY_FILE } from '../lobby.constants';

const isLobby = (value: unknown): value is Lobby =>
  isRecord(value) && typeof value.id === 'string' && typeof value.code === 'string' && Array.isArray(value.members);

const createLobbyStore = (files: DataFiles): LobbyStore => {
  const fileOf = (lobbyId: string, sha256: string) => `${lobbyId}/${FILES_DIR}/${sha256}`;
  const load = async () => {
    const entries = await files.list();
    const read = await Promise.all(entries.filter((entry) => entry.isDirectory).map((entry) => files.readJson<unknown>(`${entry.name}/${LOBBY_FILE}`, null)));
    return read.filter(isLobby);
  };
  return {
    load,
    save: (lobby) => files.writeJson(`${lobby.id}/${LOBBY_FILE}`, lobby),
    hasFile: (lobbyId, sha256) => files.exists(fileOf(lobbyId, sha256)),
    readFile: (lobbyId, sha256) => files.readBytes(fileOf(lobbyId, sha256)),
    writeFile: (lobbyId, sha256, bytes) => files.writeBytes(fileOf(lobbyId, sha256), bytes),
    removeFile: (lobbyId, sha256) => files.remove(fileOf(lobbyId, sha256)),
    dir: (lobbyId) => files.path(lobbyId),
  };
};

export { createLobbyStore };
