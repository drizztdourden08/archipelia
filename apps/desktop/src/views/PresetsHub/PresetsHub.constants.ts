/* @layer renderer-app @kind config */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';

const RECENT_DAYS = 7;

const DAY_MS = 86_400_000;

const DEFAULTS = '';

const DISCARD_CONFIRM: ConfirmActionOptions = {
  title: 'Discard changes',
  message: 'This preset has unsaved changes. Leave it and lose them?',
  confirmLabel: 'Discard',
  variant: 'danger',
};

const FAILURE = {
  load: 'Could not load your presets.',
  duplicate: 'Could not duplicate the preset.',
  remove: 'Could not delete the preset.',
} as const;

export { DAY_MS, DEFAULTS, DISCARD_CONFIRM, FAILURE, RECENT_DAYS };
