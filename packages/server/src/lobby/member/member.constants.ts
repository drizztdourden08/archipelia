/* @layer core @kind config */
import type { Failure } from '@archipelia/lobby-protocol';

const NORMAL_CLOSE = 1000;

const NO_FILE: Failure = { code: 'bad-message', message: 'No file of this player has this id.', field: 'fileId' };

export { NO_FILE, NORMAL_CLOSE };
