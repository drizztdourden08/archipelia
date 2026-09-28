/* @layer renderer-app @kind logic */
const versionParts = (version: string) => version.split(/[.+-]/).map((part) => Number.parseInt(part, 10) || 0);

const compareVersions = (a: string, b: string) => {
  const [left, right] = [versionParts(a), versionParts(b)];
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

export { compareVersions };
