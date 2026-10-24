/* @layer core @kind logic */
import type { TrustFailureReason, VerifyFailure } from './verify-world.type';

const trustFail = (reason: TrustFailureReason, detail: string): VerifyFailure => ({
  ok: false,
  code: reason === 'revoked' ? 'client-revoked' : 'trust-failed',
  reason,
  detail,
});

export { trustFail };
