/* @layer core @kind logic */
import type { HashDecision } from './hash-decision.type';

const hashDecision = (expected: string | undefined, actual: string, what: string): HashDecision => {
  if (expected === undefined) return { sha256: actual, verified: false };
  if (expected.toLowerCase() !== actual.toLowerCase()) {
    throw new Error(`${what}: sha256 is ${actual}, the catalog expects ${expected}`);
  }
  return { sha256: actual, verified: true };
};

export { hashDecision };
