/* @layer testing @kind types */
import type { KeyPairKeyObjectResult } from 'node:crypto';
import type { TrustedRoot } from '@sigstore/protobuf-specs';

type Identity = { repo: string; workflow: string; ref: string };

type MintedSigstore = {
  trustedRoot: TrustedRoot;
  expiredRoot: TrustedRoot;
  attest: (statement: unknown, identity: Identity) => Promise<unknown>;
};

type RootParts = {
  logKey: KeyPairKeyObjectResult;
  ctKey: KeyPairKeyObjectResult;
  caCertificate: ArrayBufferView;
  start: Date;
  end?: Date;
};

export type { Identity, MintedSigstore, RootParts };
