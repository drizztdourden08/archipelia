/* @layer core @kind config */
import type { PlayerStatus } from './live-room.type';

const STATUS_KEY_PREFIX = '_read_client_status_';

const HINTS_KEY_PREFIX = '_read_hints_';

const STATUS_STEPS: readonly [number, PlayerStatus][] = [[30, 'goal'], [20, 'playing'], [10, 'ready'], [5, 'connected']];

export { HINTS_KEY_PREFIX, STATUS_KEY_PREFIX, STATUS_STEPS };
