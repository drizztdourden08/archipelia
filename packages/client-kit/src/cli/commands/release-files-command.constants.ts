/* @layer client-kit @kind config */

const RELEASE_FILES_OPTIONS = {
  dir: { type: 'string' },
  module: { type: 'string' },
  direct: { type: 'boolean' },
  'player-file': { type: 'string' },
  thumbnail: { type: 'string' },
  description: { type: 'string' },
} as const;

export { RELEASE_FILES_OPTIONS };
