/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import { badValue } from './bad-value';
import { SHA256_HEX } from './index.constants';

const checkHashAndSize = (label: string, sha256: string, size: number): KitIssue[] => {
  const issues: KitIssue[] = [];
  if (!SHA256_HEX.test(sha256)) issues.push(badValue('builds', `${label}: sha256 must be 64 lowercase hex characters.`));
  if (!Number.isInteger(size) || size <= 0) issues.push(badValue('builds', `${label}: size must be a positive whole number of bytes.`));
  return issues;
};

export { checkHashAndSize };
