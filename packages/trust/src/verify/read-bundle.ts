/* @layer core @kind logic */
import { assertBundleLatest, bundleFromJSON, isBundleWithDsseEnvelope } from '@sigstore/bundle';
import type { BundleWithDsseEnvelope } from '@sigstore/bundle';
import { trustFail } from './trust-fail';
import type { VerifyFailure } from './verify-world.type';

const readBundle = (value: unknown): { bundle: BundleWithDsseEnvelope } | VerifyFailure => {
  try {
    const bundle = bundleFromJSON(value);
    assertBundleLatest(bundle);
    if (!isBundleWithDsseEnvelope(bundle)) {
      return trustFail('bundle-not-attestation', 'the bundle signs raw bytes, not an in-toto attestation');
    }
    return { bundle };
  } catch (error) {
    return trustFail('bundle-invalid', error instanceof Error ? error.message : 'the bundle cannot be read');
  }
};

export { readBundle };
