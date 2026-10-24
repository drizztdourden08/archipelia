/* @layer core @kind logic */
import type { Failure } from '@drizztdourden08/archipelia-lobby-protocol';
import type { RegistryClient } from '@archipelia/trust';
import { findClient } from '@archipelia/trust';
import type { LobbyTrust } from '../lobby-service.type';
import type { Assessed, TrustRequest } from './join-lobby.type';

const revoked = (client: RegistryClient): Failure => ({ code: 'client-revoked', message: `The registry has revoked ${client.name}. Update the client.` });

const notVerified = (game: string): Failure => ({ code: 'trust-failed', message: `The proof for ${game} does not verify.` });

const checkListed = async (request: TrustRequest, client: RegistryClient, trust: LobbyTrust): Promise<Failure | null> => {
  if (client.status === 'revoked') return revoked(client);
  for (const world of request.worlds) {
    if (world.proof?.method !== 'github-attestation') return notVerified(world.game);
    const verdict = await trust.verifyProof(world.sha256, world.proof.bundle, client);
    if (!verdict.ok) return verdict.code === 'client-revoked' ? revoked(client) : notVerified(world.game);
  }
  return null;
};

const assessClient = async (request: TrustRequest, trust: LobbyTrust, at: number): Promise<Assessed> => {
  const { id, name } = request.client;
  const client = findClient(await trust.registry(), id);
  if (!client) return { clientId: id, clientName: name, trust: { ok: true, value: { level: 'unlisted', detail: 'not in the registry', checkedAt: at } } };
  const failure = await checkListed(request, client, trust);
  if (failure) return { clientId: id, clientName: name, trust: { ok: false, failure } };
  return { clientId: id, clientName: name, trust: { ok: true, value: { level: 'verified', clientId: client.id, detail: `listed in the registry as ${client.name}`, checkedAt: at } } };
};

export { assessClient };
