/* @layer renderer-app @kind config */
import type { EmptyKind } from './GameStore.type';

const SOURCE_LABEL = { official: 'Official', index: 'Community', file: 'From file' } as const;

const MAX_CARDS = 120;

const EMPTY_TEXT: Record<EmptyKind, string> = {
  loading: 'Loading the catalog',
  search: 'No world matches',
  updates: 'Every installed game is up to date',
  installed: 'No game installed yet',
  catalog: 'No world in this list yet',
};

const APWORLD = ['apworld'];

export { APWORLD, EMPTY_TEXT, MAX_CARDS, SOURCE_LABEL };
