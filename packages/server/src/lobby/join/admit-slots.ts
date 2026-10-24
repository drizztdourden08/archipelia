/* @layer core @kind logic */
import type { Failure, SlotEntry, WorldEntry } from '@archipelia/lobby-protocol';
import { checkWorldVersion } from '@archipelia/lobby-protocol';
import type { Lobby, SlotUpload, UploadTrust, WorldUpload } from '@archipelia/model';
import type { Outcome } from '../lobby-service.type';
import { fixedWorlds } from '../state/fixed-worlds';
import { liveMembers } from '../state/live-members';
import type { Admitted, SlotRequest } from './admit-slots.type';

const otherBuild = (lobby: Lobby, memberId: string, world: WorldEntry, trust: UploadTrust): Failure | null => {
  const live = new Set(liveMembers(lobby).map((member) => member.id));
  const other = lobby.worlds.find((known) => known.game === world.game && known.sha256 !== world.sha256 && known.memberId !== memberId && live.has(known.memberId));
  if (!other || (other.trust.level === 'verified' && trust.level === 'verified')) return null;
  return { code: 'world-version-conflict', message: `This lobby already uses another build of ${world.game} ${world.worldVersion}. Use that build and join again.`, field: 'worlds' };
};

const worldFailure = (lobby: Lobby, memberId: string, request: SlotRequest): Failure | null => {
  const fixed = fixedWorlds(lobby, memberId);
  for (const world of request.worlds) {
    const failure = checkWorldVersion(fixed.get(world.game), world.game, world.worldVersion) ?? otherBuild(lobby, memberId, world, request.trust);
    if (failure) return failure;
  }
  return null;
};

const uploadOf = (world: WorldEntry, memberId: string, trust: UploadTrust): WorldUpload => ({
  sha256: world.sha256, size: world.size, game: world.game, module: world.module, worldVersion: world.worldVersion, memberId, trust,
  ...(world.proof?.method === 'github-attestation' ? { proof: world.proof.bundle } : {}),
});

const slotOf = (slot: SlotEntry, world: WorldEntry | undefined, fixed: Map<string, string>): SlotUpload => ({
  name: slot.name, game: slot.game, yamlSha256: slot.yaml.sha256, yamlSize: slot.yaml.size, state: 'uploading',
  ...(world ? { worldSha256: world.sha256, worldVersion: world.worldVersion } : {}),
  ...(!world && fixed.has(slot.game) ? { worldVersion: fixed.get(slot.game) } : {}),
});

const admitSlots = (lobby: Lobby, memberId: string, request: SlotRequest): Outcome<Admitted> => {
  const failure = worldFailure(lobby, memberId, request);
  if (failure) return { ok: false, failure };
  const fixed = fixedWorlds(lobby, memberId);
  const taken = new Set(liveMembers(lobby).filter((member) => member.id !== memberId).flatMap((member) => member.slots.map((slot) => slot.name)));
  const slots: SlotUpload[] = [];
  const notices: Failure[] = [];
  for (const [index, slot] of request.slots.entries()) {
    if (taken.has(slot.name)) {
      notices.push({ code: 'slot-name-taken', message: `Another player already uses the slot name ${slot.name}. Send slots.set with another name.`, field: `slots[${index}].name`, slot: slot.name });
      continue;
    }
    taken.add(slot.name);
    slots.push(slotOf(slot, request.worlds.find((world) => world.game === slot.game), fixed));
  }
  return { ok: true, value: { slots, worlds: request.worlds.map((world) => uploadOf(world, memberId, request.trust)), notices } };
};

export { admitSlots };
