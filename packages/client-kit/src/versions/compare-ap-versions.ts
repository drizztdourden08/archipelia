/* @layer client-kit @kind logic */
import { createKitError } from '../errors/create-kit-error';
import { parseApVersion } from './parse-ap-version';

const partsOf = (version: string): number[] => {
  const parts = parseApVersion(version);
  if (parts === null) throw createKitError('invalid-version', `"${version}" is not an Archipelago version such as 0.6.8.`);
  return parts;
};

const compareApVersions = (left: string, right: string): -1 | 0 | 1 => {
  const a = partsOf(left);
  const b = partsOf(right);
  const at = a.findIndex((part, position) => part !== b[position]);
  if (at === -1) return 0;
  return (a[at] ?? 0) < (b[at] ?? 0) ? -1 : 1;
};

export { compareApVersions };
