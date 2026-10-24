/* @layer testing @kind logic */
import { createHash } from 'node:crypto';
import type { KeyPairKeyObjectResult } from 'node:crypto';
import { TrustedRoot } from '@sigstore/protobuf-specs';
import type { RootParts } from './mint.type';

const spki = (pair: KeyPairKeyObjectResult) => pair.publicKey.export({ format: 'der', type: 'spki' });

const logOf = (pair: KeyPairKeyObjectResult, baseUrl: string, start: Date) => ({
  baseUrl,
  hashAlgorithm: 'SHA2_256',
  publicKey: { rawBytes: spki(pair).toString('base64'), keyDetails: 'PKIX_ECDSA_P256_SHA_256', validFor: { start: start.toISOString() } },
  logId: { keyId: createHash('sha256').update(spki(pair)).digest('base64') },
});

const trustedRootOf = ({ logKey, ctKey, caCertificate, start, end }: RootParts): TrustedRoot =>
  TrustedRoot.fromJSON({
    mediaType: 'application/vnd.dev.sigstore.trustedroot+json;version=0.1',
    tlogs: [logOf(logKey, 'https://rekor.test', start)],
    ctlogs: [logOf(ctKey, 'https://ct.test', start)],
    certificateAuthorities: [
      {
        subject: { organization: 'sigstore.mock', commonName: 'sigstore' },
        uri: 'https://fulcio.test',
        certChain: { certificates: [{ rawBytes: Buffer.from(caCertificate.buffer, caCertificate.byteOffset, caCertificate.byteLength).toString('base64') }] },
        validFor: { start: start.toISOString(), ...(end ? { end: end.toISOString() } : {}) },
      },
    ],
    timestampAuthorities: [],
  });

export { trustedRootOf };
