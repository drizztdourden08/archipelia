/* @layer tooling-scripts @kind logic */
import { versionParts } from './version-parts.mjs';

const compareVersions = (a, b) => {
  const left = versionParts(a);
  const right = versionParts(b);
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);
    if (diff !== 0) return diff < 0 ? -1 : 1;
  }
  return 0;
};

export { compareVersions };
