/* @layer renderer-app @kind config */
const CONSENT_TEXT = {
  intro: (title: string) => `${title} needs these Python packages. They install into the engine's Python on this computer.`,
  direct: (title: string) => `Required by ${title}`,
  dependencies: 'Their dependencies',
  wheels: 'Packages from GitHub',
  wheelFrom: (tag: string, repo: string) => `from GitHub release ${tag} of ${repo}`,
  wheelBuilt: (repo: string, short: string) => `built on this computer from ${repo} at ${short}`,
  wheelArchive: (sha256: string) => `source sha256 ${sha256}`,
  wheelBuiltNote: 'Archipelia built this file from the source above. The code of the project ran on this computer.',
  wheelOlder: (newest: string, tag: string) => `Not the newest release: the newest is ${newest}, but it has no build for this engine, so this is the older release ${tag}.`,
  wheelDigest: (sha256: string) => `sha256 ${sha256}`,
  wheelChecked: 'GitHub published this checksum and the download matched it.',
  wheelUnchecked: 'GitHub published no checksum for this file. You confirmed it by typing the repo name.',
  accept: 'Install packages and add',
  cancel: 'Cancel',
} as const;

export { CONSENT_TEXT };
