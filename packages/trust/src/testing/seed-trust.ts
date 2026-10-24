/* @layer testing @kind logic */
import registryFile from 'archipelia/registry/registry.json' with { type: 'json' };
import nock from 'nock';
import type { DataFiles } from '@archipelia/model';
import { loadRegistry } from '../registry/load-registry';
import { loadTrustedRoot } from '../verify/load-trusted-root';
import { mintSigstore } from './mint-sigstore';
import { SEED_IDENTITY } from './seed-trust.constants';
import { statementOf } from './statement-of';

const seedTrust = async (cache: DataFiles, world: Uint8Array): Promise<unknown> => {
  const sigstore = await mintSigstore();
  const proof = await sigstore.attest(statementOf(world), SEED_IDENTITY);
  nock.cleanAll();
  nock.enableNetConnect();
  await loadTrustedRoot({ files: cache, fetchRoot: () => Promise.resolve(sigstore.trustedRoot) });
  await loadRegistry({ files: cache, fetch: () => Promise.resolve(new Response(JSON.stringify(registryFile), { status: 200 })) });
  return proof;
};

export { seedTrust };
