/* @layer core @kind config */
import type { Failure } from '@archipelia/lobby-protocol';

const UNEXPECTED: Failure = { code: 'upload-unexpected', message: 'This lobby did not ask for that file.' };
const HASH_MISMATCH: Failure = { code: 'upload-hash-mismatch', message: 'The bytes of the file do not match its hash. Send the file again.' };
const NOT_BEGUN = 'No upload of this file was begun. Send upload.begin first.';
const PAST_SIZE = 'The upload goes past its declared size.';

export { HASH_MISMATCH, NOT_BEGUN, PAST_SIZE, UNEXPECTED };
