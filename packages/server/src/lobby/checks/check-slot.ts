/* @layer core @kind logic */
import type { Failure } from '@archipelia/lobby-protocol';
import type { Lobby, LobbyMember, SlotUpload } from '@archipelia/model';
import type { LobbyContext } from '../lobby-context.type';
import { checkYaml } from './check-yaml';
import type { SlotJob, SlotVerdict, WorldVerdict } from './check-slot.type';
import { verifyWorldBytes } from './verify-world-bytes';

const refused = (member: LobbyMember, slot: SlotUpload, failure: Failure, fatal = false): SlotVerdict =>
  ({ memberId: member.id, slot: slot.name, state: 'refused', failure: { ...failure, slot: slot.name }, fatal });

const consentState = (lobby: Lobby, slot: SlotUpload): SlotVerdict['state'] | Failure => {
  const world = lobby.worlds.find((known) => known.sha256 === slot.worldSha256);
  if (!world || world.trust.level === 'verified') return 'ok';
  if (!world.consent) return 'waiting-consent';
  return world.consent.allowed ? 'ok' : { code: 'consent-refused', message: `The host did not allow the world for ${world.game}.` };
};

const checkSlot = async (ctx: LobbyContext, { lobby, member, slot }: SlotJob, worlds: Map<string, Promise<WorldVerdict>>): Promise<SlotVerdict> => {
  const consent = consentState(lobby, slot);
  if (typeof consent !== 'string') return refused(member, slot, consent);
  if (consent === 'waiting-consent') return { memberId: member.id, slot: slot.name, state: consent };
  const world = lobby.worlds.find((known) => known.sha256 === slot.worldSha256);
  if (world) {
    const pending = worlds.get(world.sha256) ?? verifyWorldBytes(ctx, lobby, world);
    worlds.set(world.sha256, pending);
    const verdict = await pending;
    if (verdict) return refused(member, slot, verdict.failure, verdict.fatal);
  }
  const yaml = checkYaml(slot, await ctx.deps.store.readFile(lobby.id, slot.yamlSha256));
  return yaml ? refused(member, slot, yaml) : { memberId: member.id, slot: slot.name, state: 'ok' };
};

export { checkSlot };
