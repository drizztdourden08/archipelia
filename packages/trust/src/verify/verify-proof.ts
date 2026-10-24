/* @layer core @kind logic */
import type { TrustedRoot } from '@sigstore/protobuf-specs';
import type { RegistryClient } from '../registry/registry.type';
import { checkSignature } from './check-signature';
import { checkStatement } from './check-statement';
import { readBundle } from './read-bundle';
import { trustFail } from './trust-fail';
import type { ProofVerdict } from './verify-world.type';

const verifyProof = (sha256: string, bundle: unknown, client: RegistryClient, trustedRoot: TrustedRoot): ProofVerdict => {
  if (client.status === 'revoked') return trustFail('revoked', `${client.name} is revoked in the registry`);
  const read = readBundle(bundle);
  if ('ok' in read) return read;
  const statement = checkStatement(read.bundle, sha256);
  if (statement) return statement;
  const signed = checkSignature(read.bundle, client.trust, trustedRoot);
  if ('ok' in signed) return signed;
  return { ok: true, signer: signed.signer };
};

export { verifyProof };
