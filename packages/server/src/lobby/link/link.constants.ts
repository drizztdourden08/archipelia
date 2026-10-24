/* @layer core @kind config */
import type { Failure } from '@archipelia/lobby-protocol';

const MS_PER_SECOND = 1000;

const GOING_AWAY = 1001;

const BINARY: Failure = { code: 'bad-message', message: 'Binary frames are not used.' };
const HELLO_FIRST: Failure = { code: 'bad-message', message: 'Send lobby.info or hello first.' };
const JOINED: Failure = { code: 'bad-message', message: 'This connection already joined the lobby.' };
const NO_HELLO: Failure = { code: 'bad-message', message: 'No hello arrived in time.' };
const OTHER_UPLOAD: Failure = { code: 'bad-message', message: 'Begin the upload of this file before sending its chunks.' };

export { BINARY, GOING_AWAY, HELLO_FIRST, JOINED, MS_PER_SECOND, NO_HELLO, OTHER_UPLOAD };
