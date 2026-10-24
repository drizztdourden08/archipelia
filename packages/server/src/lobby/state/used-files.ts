/* @layer core @kind logic */
import type { Lobby, LobbyMember } from '@archipelia/model';
import type { MemberFile } from './member-files.type';
import { ownWorld } from './own-world';

const usedFiles = (lobby: Lobby, member: LobbyMember): MemberFile[] => {
  const files = new Map<string, MemberFile>();
  for (const slot of member.slots) {
    const world = ownWorld(lobby, member.id, slot);
    if (world) files.set(world.sha256, { sha256: world.sha256, size: world.size, kind: 'world' });
    files.set(slot.yamlSha256, { sha256: slot.yamlSha256, size: slot.yamlSize, kind: 'yaml' });
  }
  return [...files.values()];
};

export { usedFiles };
