/* @layer core @kind logic */
import type { ReleaseMode, RemainingMode, ServerSettings } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import { check } from './check-keys';
import { HINT_RANGE, RELEASE_MODES, REMAINING_MODES, SERVER_KEYS, SHUTDOWN_RANGE } from './options.constants';
import { readChoice } from './read-choice';
import { readWhole } from './read-whole';

const readServerSettings = (value: unknown, base: ServerSettings): ServerSettings => {
  if (!isRecord(value)) throw new Error('options.server must be an object');
  check('options.server', value, SERVER_KEYS);
  const release = (key: 'releaseMode' | 'collectMode'): ReleaseMode =>
    (value[key] === undefined ? base[key] : readChoice(`options.server.${key}`, value[key], RELEASE_MODES));
  const remaining: RemainingMode = value.remainingMode === undefined ? base.remainingMode : readChoice('options.server.remainingMode', value.remainingMode, REMAINING_MODES);
  return {
    ...base,
    hintCost: value.hintCost === undefined ? base.hintCost : readWhole('options.server.hintCost', value.hintCost, HINT_RANGE),
    releaseMode: release('releaseMode'),
    collectMode: release('collectMode'),
    remainingMode: remaining,
    autoShutdownMinutes: value.autoShutdownMinutes === undefined ? base.autoShutdownMinutes : readWhole('options.server.autoShutdownMinutes', value.autoShutdownMinutes, SHUTDOWN_RANGE),
  };
};

export { readServerSettings };
