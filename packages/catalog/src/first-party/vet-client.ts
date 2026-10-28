/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import type { RegistryClient } from '@archipelia/trust';
import type { TrustDeps } from './vet-release.type';

const vetClient = ({ displayName, firstParty }: CatalogEntry, trust: TrustDeps | undefined): { client: RegistryClient; trust: TrustDeps } => {
  const client = trust?.clients.find((candidate) => candidate.id === firstParty?.client);
  if (!trust || !client) throw new Error(`${displayName} is refused: its client ${String(firstParty?.client)} is not in the registry`);
  if (client.status === 'revoked') throw new Error(`${displayName} is refused: ${client.name} is revoked in the registry`);
  return { client, trust };
};

export { vetClient };
