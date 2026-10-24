/* @layer core @kind logic */
import type { Lobby, SlotUpload, WorldUpload } from '@archipelia/model';

const ownWorld = (lobby: Lobby, memberId: string, slot: SlotUpload): WorldUpload | undefined =>
  slot.worldSha256 === undefined ? undefined : lobby.worlds.find((world) => world.memberId === memberId && world.sha256 === slot.worldSha256);

export { ownWorld };
