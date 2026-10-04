/* @layer renderer-app @kind config */
const SOURCE_LABEL = { official: 'Official', index: 'Community', file: 'From file' } as const;

const MAX_CARDS = 120;

const APWORLD = ['apworld'];

const FAILURE = {
  load: 'Could not load the games.',
  install: 'Could not install the game.',
  remove: 'Could not remove the game.',
  file: 'Could not add the game from that file.',
} as const;

export { APWORLD, FAILURE, MAX_CARDS, SOURCE_LABEL };
