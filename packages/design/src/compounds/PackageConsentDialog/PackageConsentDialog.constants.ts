/* @layer renderer-app @kind config */
const CONSENT_TEXT = {
  intro: (title: string) => `${title} needs these Python packages. They install into the engine's Python on this computer.`,
  direct: (title: string) => `Required by ${title}`,
  dependencies: 'Their dependencies',
  accept: 'Install packages and add',
  cancel: 'Cancel',
} as const;

export { CONSENT_TEXT };
