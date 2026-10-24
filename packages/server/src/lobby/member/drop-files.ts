/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import type { LobbyStore } from '../lobby-service.type';
import { liveMembers } from '../state/live-members';
import { memberFiles } from '../state/member-files';

const dropFiles = async (store: LobbyStore, lobby: Lobby, memberId: string) => {
  const member = lobby.members.find((candidate) => candidate.id === memberId);
  if (!member) return;
  const kept = new Set(liveMembers(lobby).filter((other) => other.id !== memberId).flatMap((other) => memberFiles(lobby, other).map((file) => file.sha256)));
  const owned = memberFiles(lobby, member).filter((file) => !kept.has(file.sha256));
  await Promise.all(owned.map((file) => store.removeFile(lobby.id, file.sha256)));
};

export { dropFiles };
