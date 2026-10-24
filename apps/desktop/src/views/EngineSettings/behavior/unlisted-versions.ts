/* @layer renderer-app @kind logic */
const unlistedVersions = (installed: readonly string[], listed: readonly string[]): string[] =>
  installed.filter((version, index) => installed.indexOf(version) === index && !listed.includes(version));

export { unlistedVersions };
