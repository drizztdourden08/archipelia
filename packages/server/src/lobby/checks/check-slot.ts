/* @layer core @kind logic */
import type { Failure } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby, LobbyMember, SlotUpload } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { ownWorld } from '../state/own-world';
import { checkYaml } from './check-yaml';
import type { SlotJob, SlotVerdict, WorldVerdict } from './check-slot.type';
import { verdictOf } from './verdict-of';
import { verifyWorldBytes } from './verify-world-bytes';

const refused = (member: LobbyMember, slot: SlotUpload, failure: Failure, fatal = false): SlotVerdict =>
  ({ ...verdictOf(member, slot, 'refused', { ...failure, slot: slot.name }), fatal });

const consentState = (lobby: Lobby, member: LobbyMember, slot: SlotUpload): 'ok' | 'waiting-consent' | Failure => {
  if (slot.worldSha256 === undefined) return 'ok';
  const world = ownWorld(lobby, member.id, slot);
  if (!world) return { code: 'world-invalid', message: `The world for ${slot.game} was not sent by this player.` };
  if (world.trust.level === 'verified') return 'ok';
  if (!world.consent) return 'waiting-consent';
  return world.consent.allowed ? 'ok' : { code: 'consent-refused', message: `The host did not allow the world for ${world.game}.` };
};

const checkSlot = async (ctx: LobbyContext, { lobby, member, slot }: SlotJob, worlds: Map<string, Promise<WorldVerdict>>): Promise<SlotVerdict> => {
  const consent = consentState(lobby, member, slot);
  if (typeof consent !== 'string') return refused(member, slot, consent);
  if (consent === 'waiting-consent') return verdictOf(member, slot, consent);
  const world = ownWorld(lobby, member.id, slot);
  if (world) {
    const key = `${member.id}/${world.sha256}`;
    const pending = worlds.get(key) ?? verifyWorldBytes(ctx, lobby, world);
    worlds.set(key, pending);
    const verdict = await pending;
    if (verdict) return refused(member, slot, verdict.failure, verdict.fatal);
  }
  const yaml = checkYaml(slot, await ctx.deps.store.readFile(lobby.id, slot.yamlSha256));
  return yaml ? refused(member, slot, yaml) : verdictOf(member, slot, 'ok');
};

export { checkSlot };
