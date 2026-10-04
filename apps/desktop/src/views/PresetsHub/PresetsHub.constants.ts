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

export { DAY_MS, DEFAULTS, DISCARD_CONFIRM, RECENT_DAYS };
