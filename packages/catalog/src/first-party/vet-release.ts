/* @layer core @kind logic */
import type { WorldTrust } from '@archipelia/model';
import { verifyWorld } from '@archipelia/trust';
import { UNVERIFIED_DETAIL } from './first-party.constants';
import { readReleaseAsset } from './read-release-asset';
import type { VetReleaseParams } from './vet-release.type';

const vetRelease = async ({ entry, bytes, bundleUrl, trust, fetch: request }: VetReleaseParams): Promise<WorldTrust | undefined> => {
  const { firstParty } = entry;
  if (!firstParty || !bundleUrl) return undefined;
  const client = trust?.clients.find((candidate) => candidate.id === firstParty.client);
  if (!trust || !client) throw new Error(`${entry.displayName} is refused: its client ${firstParty.client} is not in the registry`);
  if (client.status === 'revoked') throw new Error(`${entry.displayName} is refused: ${client.name} is revoked in the registry`);
  const bundle = await readReleaseAsset(bundleUrl, request);
  if (bundle === null) return { state: 'unverified', detail: UNVERIFIED_DETAIL };
  const verdict = verifyWorld(bytes, bundle, client, await trust.root());
  if (!verdict.ok) throw new Error(`${entry.displayName} is refused: ${verdict.detail}`);
  return { state: 'verified', detail: `Verified: signed by ${verdict.signer.repo} (${verdict.signer.workflow})` };
};

export { vetRelease };
