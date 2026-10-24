/* @layer core @kind logic */
import type { Lobby, LobbyMember } from '@archipelia/model';
import type { LobbyStore } from '../lobby-service.type';
import { memberFiles } from './member-files';

const needOf = async (store: LobbyStore, lobby: Lobby, member: LobbyMember): Promise<string[]> => {
  const files = memberFiles(lobby, member);
  const held = await Promise.all(files.map((file) => store.hasFile(lobby.id, file.sha256)));
  return files.filter((_file, index) => !held[index]).map((file) => file.sha256);
};

export { needOf };
