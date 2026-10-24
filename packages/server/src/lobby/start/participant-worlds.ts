/* @layer core @kind logic */
import type { Lobby, WorldUpload } from '@archipelia/model';
import { verifyWorldBytes } from '../checks/verify-world-bytes';
import type { LobbyContext } from '../lobby-context.type';
import { ownWorld } from '../state/own-world';
import type { Participant } from './start.type';

const cleared = async (ctx: LobbyContext, lobby: Lobby, world: WorldUpload): Promise<string | null> => {
  if (world.trust.level === 'unlisted') return world.consent?.allowed ? null : `The host has not allowed the world for ${world.game}.`;
  const verdict = await verifyWorldBytes(ctx, lobby, world);
  return verdict ? verdict.failure.message : null;
};

const participantWorlds = async (ctx: LobbyContext, lobby: Lobby, players: Participant[]): Promise<WorldUpload[]> => {
  const worlds = new Map<string, WorldUpload>();
  for (const { member, slot } of players) {
    if (slot.worldSha256 === undefined) continue;
    const world = ownWorld(lobby, member.id, slot);
    if (!world) throw new Error(`the world of ${slot.name} was not sent by its player`);
    const problem = await cleared(ctx, lobby, world);
    if (problem) throw new Error(problem);
    if (!worlds.has(world.module)) worlds.set(world.module, world);
  }
  return [...worlds.values()];
};

export { participantWorlds };
