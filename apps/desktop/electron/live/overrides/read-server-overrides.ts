/* @layer electron-main @kind logic */
import { RELEASE_MODES, REMAINING_MODES } from '@archipelia/model';
import type { RunnableServerSettings } from '../../../src/live/live.type';
import { HINT_MAX, SERVER_OVERRIDE_KEYS, SHUTDOWN_MAX } from '../live.constants';
import { readChoice } from './read-choice';
import { readCount } from './read-count';
import { readRecord } from './read-record';

const serverReaders = {
  hintCost: (value: unknown) => readCount('server.hintCost', value, HINT_MAX),
  releaseMode: (value: unknown) => readChoice('server.releaseMode', value, RELEASE_MODES),
  collectMode: (value: unknown) => readChoice('server.collectMode', value, RELEASE_MODES),
  remainingMode: (value: unknown) => readChoice('server.remainingMode', value, REMAINING_MODES),
  autoShutdownMinutes: (value: unknown) => readCount('server.autoShutdownMinutes', value, SHUTDOWN_MAX),
};

const readServerOverrides = (value: unknown): Partial<RunnableServerSettings> => {
  const given = readRecord('server', value, SERVER_OVERRIDE_KEYS);
  return Object.fromEntries(SERVER_OVERRIDE_KEYS.filter((key) => key in given).map((key) => [key, serverReaders[key](given[key])]));
};

export { readServerOverrides };
