/* @layer core @kind logic */
import type { Lobby, WorldUpload } from '@archipelia/model';
import { findClient } from '@archipelia/trust';
import type { LobbyContext } from '../lobby-context.type';
import { checkWorld } from './check-world';
import type { WorldVerdict } from './check-slot.type';

const verifyWorldBytes = async (ctx: LobbyContext, lobby: Lobby, world: WorldUpload): Promise<WorldVerdict> => {
  const bytes = await ctx.deps.store.readFile(lobby.id, world.sha256);
  const failure = checkWorld(lobby, world, bytes);
  if (failure) return { failure, fatal: false };
  if (world.trust.level !== 'verified' || !bytes) return null;
  const client = findClient(await ctx.deps.trust.registry(), world.trust.clientId ?? '');
  const verdict = client ? await ctx.deps.trust.verifyWorld(bytes, world.proof, client) : null;
  if (verdict?.ok) return null;
  return { failure: { code: 'trust-failed', message: `The proof for ${world.game} does not verify.` }, fatal: true };
};

export { verifyWorldBytes };
