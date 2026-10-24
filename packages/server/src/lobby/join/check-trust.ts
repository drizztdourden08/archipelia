/* @layer core @kind logic */
import type { Failure } from '@archipelia/lobby-protocol';
import type { Lobby, UploadTrust } from '@archipelia/model';
import type { RegistryClient } from '@archipelia/trust';
import { findClient } from '@archipelia/trust';
import type { LobbyTrust, Outcome } from '../lobby-service.type';
import type { TrustRequest } from './join-lobby.type';

const revoked = (client: RegistryClient): Failure => ({ code: 'client-revoked', message: `The registry has revoked ${client.name}. Update the client.` });

const notVerified = (game: string): Failure => ({ code: 'trust-failed', message: `The proof for ${game} does not verify.` });

const checkListed = async (hello: TrustRequest, client: RegistryClient, trust: LobbyTrust): Promise<Failure | null> => {
  if (client.status === 'revoked') return revoked(client);
  for (const world of hello.worlds) {
    if (world.proof?.method !== 'github-attestation') return notVerified(world.game);
    const verdict = await trust.verifyProof(world.sha256, world.proof.bundle, client);
    if (!verdict.ok) return verdict.code === 'client-revoked' ? revoked(client) : notVerified(world.game);
  }
  return null;
};

const checkTrust = async (hello: TrustRequest, lobby: Lobby, trust: LobbyTrust, at: number): Promise<Outcome<UploadTrust>> => {
  const client = findClient(await trust.registry(), hello.client.id);
  if (client) {
    const failure = await checkListed(hello, client, trust);
    if (failure) return { ok: false, failure };
    return { ok: true, value: { level: 'verified', clientId: client.id, detail: `listed in the registry as ${client.name}`, checkedAt: at } };
  }
  if (!lobby.options.allowUnlisted) {
    return { ok: false, failure: { code: 'unlisted-not-allowed', message: `This lobby takes listed clients only. ${hello.client.name} is not listed.` } };
  }
  return { ok: true, value: { level: 'unlisted', detail: 'not in the registry', checkedAt: at } };
};

export { checkTrust };
