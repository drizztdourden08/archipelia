/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import type { BundleWithDsseEnvelope } from '@sigstore/bundle';
import { IN_TOTO_PAYLOAD_TYPE, IN_TOTO_STATEMENT_TYPE, ATTESTED_PREDICATE } from './verify-world.constants';
import { trustFail } from './trust-fail';
import type { VerifyFailure } from './verify-world.type';

const parsePayload = (payload: Buffer): unknown => {
  try {
    return JSON.parse(payload.toString('utf8'));
  } catch {
    return null;
  }
};

const checkStatement = (bundle: BundleWithDsseEnvelope, sha256: string): VerifyFailure | null => {
  const { payloadType, payload } = bundle.content.dsseEnvelope;
  if (payloadType !== IN_TOTO_PAYLOAD_TYPE) return trustFail('predicate-mismatch', `the payload type is ${payloadType}`);
  const statement = parsePayload(payload);
  if (!isRecord(statement) || statement._type !== IN_TOTO_STATEMENT_TYPE) {
    return trustFail('predicate-mismatch', 'the payload is not an in-toto v1 statement');
  }
  if (statement.predicateType !== ATTESTED_PREDICATE) {
    return trustFail('predicate-mismatch', `the predicate type is ${String(statement.predicateType)}`);
  }
  const subjects = Array.isArray(statement.subject) ? (statement.subject as unknown[]) : [];
  const matches = subjects.some((subject) => isRecord(subject) && isRecord(subject.digest) && String(subject.digest.sha256).toLowerCase() === sha256);
  return matches ? null : trustFail('digest-mismatch', 'the attested digest is not the digest of the uploaded bytes');
};

export { checkStatement };
