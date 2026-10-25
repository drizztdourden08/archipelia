/* @layer electron-main @kind config */
const PROBE_TIMEOUT_MS = 8000;

const BAD_CODE = 'The lobby code has 8 letters and digits, such as K7QM-4XT2.';

const NO_ANSWER = 'The server did not answer in time.';

const CLOSED_BEFORE_ANSWER = 'The server closed the connection without an answer.';

const PROBE_UNREACHABLE = 'Could not reach the server.';

export { BAD_CODE, CLOSED_BEFORE_ANSWER, NO_ANSWER, PROBE_TIMEOUT_MS, PROBE_UNREACHABLE };
