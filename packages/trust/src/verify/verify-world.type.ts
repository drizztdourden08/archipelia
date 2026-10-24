/* @layer core @kind types */

type TrustFailureReason =
  | 'revoked'
  | 'bundle-invalid'
  | 'bundle-not-attestation'
  | 'digest-mismatch'
  | 'predicate-mismatch'
  | 'chain-invalid'
  | 'signer-mismatch'
  | 'game-mismatch'
  | 'world-unreadable';

type WorldSigner = { identity: string; repo: string; workflow: string; ref: string };

type WorldVerdict =
  | { ok: true; sha256: string; game: string; signer: WorldSigner }
  | { ok: false; code: 'trust-failed' | 'client-revoked'; reason: TrustFailureReason; detail: string };

type VerifyFailure = Extract<WorldVerdict, { ok: false }>;

type ProofVerdict = { ok: true; signer: WorldSigner } | VerifyFailure;

export type { ProofVerdict, TrustFailureReason, VerifyFailure, WorldSigner, WorldVerdict };
