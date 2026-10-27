/* @layer renderer-app @kind config */
import type { SpoilerLevel } from '@archipelia/model';

const SPOILER_LABEL: Record<SpoilerLevel, string> = { 0: 'no spoiler', 1: 'spoiler basic', 2: 'spoiler playthrough', 3: 'spoiler full' };

const FAILURE = {
  load: 'Could not load your sessions.',
  start: 'Could not start the session.',
  duplicate: 'Could not duplicate the session.',
  deleteSession: 'Could not delete the session.',
} as const;

export { FAILURE, SPOILER_LABEL };
