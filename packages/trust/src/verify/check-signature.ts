/* @layer core @kind logic */
import type { BundleWithDsseEnvelope } from '@sigstore/bundle';
import type { TrustedRoot } from '@sigstore/protobuf-specs';
import { PolicyError, Verifier, toSignedEntity, toTrustMaterial } from '@sigstore/verify';
import type { GithubAttestationTrust } from '../registry/registry.type';
import { identityPolicy } from './identity-policy';
import { trustFail } from './trust-fail';
import { SIGNER_PATTERN } from './verify-world.constants';
import type { VerifyFailure, WorldSigner } from './verify-world.type';

const signerOf = (identity: string): WorldSigner | null => {
  const match = SIGNER_PATTERN.exec(identity);
  const [, repo, workflow, ref] = match ?? [];
  return repo && workflow && ref ? { identity, repo, workflow, ref } : null;
};

const checkSignature = (
  bundle: BundleWithDsseEnvelope,
  trust: GithubAttestationTrust,
  trustedRoot: TrustedRoot,
): { signer: WorldSigner } | VerifyFailure => {
  try {
    const verified = new Verifier(toTrustMaterial(trustedRoot)).verify(toSignedEntity(bundle), identityPolicy(trust));
    const signer = signerOf(verified.identity?.subjectAlternativeName ?? '');
    return signer ? { signer } : trustFail('signer-mismatch', 'the certificate identity is not a GitHub workflow');
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'the signature does not verify';
    return trustFail(error instanceof PolicyError ? 'signer-mismatch' : 'chain-invalid', detail);
  }
};

export { checkSignature };
