/* @layer renderer-app @kind config */
import { defineStatuses } from '@drizztdourden08/tessera/primitives';
import type { ItemCardMediaTone } from '@drizztdourden08/tessera/composites';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { GameCardKind } from './GameCard.type';

const GAME_STATUS = defineStatuses({
  installed: { label: 'Installed', tone: 'success', icon: 'circle-check' },
  update: { label: 'Update', tone: 'warning', icon: 'arrow-big-up-dash' },
  'no-release': { label: 'No release yet', tone: 'neutral', icon: 'clock' },
  unavailable: { label: 'Not available', tone: 'warning', icon: 'circle-alert' },
});

const KIND_ICON: Record<GameCardKind, IconName> = {
  official: 'package',
  community: 'users',
  'first-party': 'sparkles',
  file: 'file',
};

const KIND_TONE: Record<GameCardKind, ItemCardMediaTone> = {
  official: 'primary',
  community: 'info',
  'first-party': 'success',
  file: 'neutral',
};

const MAX_TAGS = 2;

const MEDIA_SIZE = 32;

export { GAME_STATUS, KIND_ICON, KIND_TONE, MAX_TAGS, MEDIA_SIZE };
