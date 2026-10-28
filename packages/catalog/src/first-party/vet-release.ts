/* @layer core @kind logic */
import type { WorldTrust } from '@archipelia/model';
import { verifyWorld } from '@archipelia/trust';
import { UNVERIFIED_DETAIL } from './first-party.constants';
import { readReleaseAsset } from './read-release-asset';
import { vetClient } from './vet-client';
import type { VetReleaseParams } from './vet-release.type';

const vetRelease = async ({ entry, bytes, bundleUrl, trust, fetch: request }: VetReleaseParams): Promise<WorldTrust | undefined> => {
  if (!entry.firstParty || !bundleUrl) return undefined;
  const vetted = vetClient(entry, trust);
  const bundle = await readReleaseAsset(bundleUrl, request);
  if (bundle === null) return { state: 'unverified', detail: UNVERIFIED_DETAIL };
  const verdict = verifyWorld(bytes, bundle, vetted.client, await vetted.trust.root());
  if (!verdict.ok) throw new Error(`${entry.displayName} is refused: ${verdict.detail}`);
  return { state: 'verified', detail: `Verified: signed by ${verdict.signer.repo} (${verdict.signer.workflow})` };
};

export { vetRelease };
