/* @layer renderer-app @kind config */
const CONSENT_TEXT = {
  intro: (title: string) => `${title} needs these Python packages. They install into the engine's Python on this computer.`,
  direct: (title: string) => `Required by ${title}`,
  dependencies: 'Their dependencies',
  wheels: 'Ready-made builds from GitHub',
  wheelFrom: (tag: string, repo: string) => `from GitHub release ${tag} of ${repo}`,
  wheelOlder: (newest: string, tag: string) => `Not the newest release: the newest is ${newest}, but it has no build for this engine, so this is the older release ${tag}.`,
  wheelDigest: (sha256: string) => `sha256 ${sha256}`,
  wheelChecked: 'GitHub published this checksum and the download matched it.',
  wheelUnchecked: 'GitHub published no checksum for this file. You confirmed it by typing the repo name.',
  accept: 'Install packages and add',
  cancel: 'Cancel',
} as const;

export { CONSENT_TEXT };
