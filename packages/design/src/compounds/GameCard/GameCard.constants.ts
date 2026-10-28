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
  adding: { label: 'Adding...', tone: 'info', icon: 'download' },
  updating: { label: 'Updating...', tone: 'info', icon: 'download' },
  removing: { label: 'Removing...', tone: 'info', icon: 'trash-2' },
  'needs-package': { label: 'Needs a package Archipelia cannot install', tone: 'warning', icon: 'circle-alert' },
  failed: { label: 'Failed', tone: 'danger', icon: 'circle-alert' },
});

const KIND_ICON: Record<GameCardKind, IconName> = {
  'built-in': 'package',
  'archipelia-ready': 'sparkles',
  'archipelago-index': 'globe',
  file: 'file',
};

const KIND_TONE: Record<GameCardKind, ItemCardMediaTone> = {
  'built-in': 'primary',
  'archipelia-ready': 'tertiary',
  'archipelago-index': 'info',
  file: 'neutral',
};

const MAX_TAGS = 2;

const VERIFIED_LABEL = 'Verified';

const VERIFIED_HINT = 'Listed and checked by Archipelia';

const DIRECT_LABEL = 'Joins directly';

const DIRECT_HINT = 'Players join a session from inside the game';

const MEDIA_SIZE = 32;

export { DIRECT_HINT, DIRECT_LABEL, GAME_STATUS, KIND_ICON, KIND_TONE, MAX_TAGS, MEDIA_SIZE, VERIFIED_HINT, VERIFIED_LABEL };
