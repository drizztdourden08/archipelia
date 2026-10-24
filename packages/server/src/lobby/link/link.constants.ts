/* @layer core @kind config */
import type { Failure } from '@archipelia/lobby-protocol';

const MS_PER_SECOND = 1000;

const HELLO_DEADLINE_MS = 60000;

const ADMIN_HELLO_LIMIT = 5;
const ADMIN_HELLO_WINDOW_MS = 60000;

const GENERIC_FAULT = 'see the server log';

const GOING_AWAY = 1001;

const BINARY: Failure = { code: 'bad-message', message: 'Binary frames are not used.' };
const HELLO_FIRST: Failure = { code: 'bad-message', message: 'Send lobby.info or hello first.' };
const JOINED: Failure = { code: 'bad-message', message: 'This connection already joined the lobby.' };
const NO_HELLO: Failure = { code: 'bad-message', message: 'No hello arrived in time.' };
const OTHER_UPLOAD: Failure = { code: 'bad-message', message: 'Begin the upload of this file before sending its chunks.' };

const GONE: Failure = { code: 'refused', message: 'This player is no longer in the lobby.' };

export { ADMIN_HELLO_LIMIT, ADMIN_HELLO_WINDOW_MS, BINARY, GENERIC_FAULT, GONE, GOING_AWAY, HELLO_DEADLINE_MS, HELLO_FIRST, JOINED, MS_PER_SECOND, NO_HELLO, OTHER_UPLOAD };
