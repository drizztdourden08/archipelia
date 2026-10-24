/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { LobbyStore } from '../lobby-service.type';
import { liveMembers } from '../state/live-members';
import { usedFiles } from '../state/used-files';

const pruneFiles = async (store: LobbyStore, lobby: Lobby) => {
  const kept = new Set(liveMembers(lobby).flatMap((member) => usedFiles(lobby, member).map((file) => file.sha256)));
  const stale = (await store.listFiles(lobby.id)).filter((sha256) => !kept.has(sha256));
  await Promise.all(stale.map((sha256) => store.removeFile(lobby.id, sha256)));
  return stale.length;
};

export { pruneFiles };
