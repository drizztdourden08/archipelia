/* @layer protocol @kind logic */
import { parseApVersion } from './parse-ap-version';

const compareApVersions = (left: string, right: string): number => {
  const a = parseApVersion(left);
  const b = parseApVersion(right);
  if (a === null || b === null) throw new Error(`not an Archipelago version: ${a === null ? left : right}`);
  for (let index = 0; index < 3; index += 1) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference < 0 ? -1 : 1;
  }
  return 0;
};

export { compareApVersions };
