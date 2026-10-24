/* @layer core @kind logic */
import type { Lobby, LobbyMember } from '@archipelia/model';
import type { MemberFile } from './member-files.type';

const memberFiles = (lobby: Lobby, member: LobbyMember): MemberFile[] => {
  const worlds = lobby.worlds.filter((world) => world.memberId === member.id).map((world): MemberFile => ({ sha256: world.sha256, size: world.size, kind: 'world' }));
  const yamls = member.slots.map((slot): MemberFile => ({ sha256: slot.yamlSha256, size: slot.yamlSize, kind: 'yaml' }));
  const seen = new Set<string>();
  return [...worlds, ...yamls].filter((file) => !seen.has(file.sha256) && Boolean(seen.add(file.sha256)));
};

export { memberFiles };
