/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { hashDecision } from '../src/install/hash-decision';

const A = 'a'.repeat(64);
const B = 'b'.repeat(64);

describe('hashDecision', () => {
  test('a matching hash is verified', () => {
    expect(hashDecision(A, A, 'demo')).toEqual({ sha256: A, verified: true });
  });

  test('case does not matter', () => {
    expect(hashDecision(A.toUpperCase(), A, 'demo').verified).toBe(true);
  });

  test('a different hash stops the install', () => {
    expect(() => hashDecision(A, B, 'demo 1.0.0')).toThrow(/demo 1\.0\.0: sha256 is b+, the catalog expects a+/);
  });

  test('without a catalog hash the computed one is kept unverified', () => {
    expect(hashDecision(undefined, B, 'demo')).toEqual({ sha256: B, verified: false });
  });
});
