/* @layer core @kind logic */

const versionParts = (version: string): number[] => {
  const parts = version.split('.').map((part) => Number.parseInt(part, 10) || 0);
  while (parts.length < 3) parts.push(0);
  return parts;
};

export { versionParts };
