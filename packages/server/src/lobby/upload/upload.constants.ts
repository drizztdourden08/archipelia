/* @layer core @kind config */
import type { Failure } from '@archipelia/lobby-protocol';

const UNEXPECTED: Failure = { code: 'upload-unexpected', message: 'This lobby did not ask for that file.' };
const HASH_MISMATCH: Failure = { code: 'upload-hash-mismatch', message: 'The bytes of the file do not match its hash. Send the file again.' };
const NOT_MEMBER: Failure = { code: 'refused', message: 'This player is no longer in the lobby.' };
const SERVER_BUSY: Failure = { code: 'upload-too-large', message: 'The server holds too many unfinished uploads. Try again later.' };
const MAX_PENDING_BYTES = 512 * 1024 * 1024;
const PART_TTL_MS = 10 * 60 * 1000;
const NOT_BEGUN = 'No upload of this file was begun. Send upload.begin first.';
const PAST_SIZE = 'The upload goes past its declared size.';

export { HASH_MISMATCH, MAX_PENDING_BYTES, NOT_BEGUN, NOT_MEMBER, PART_TTL_MS, PAST_SIZE, SERVER_BUSY, UNEXPECTED };
