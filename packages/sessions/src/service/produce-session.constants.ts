/* @layer core @kind config */
import { constants } from 'node:fs';

const CONFINED_DIR = 'confined';

const ARCHIVE_NAME = /^AP_[\w-]+\.zip$/;

const MINUTE_MS = 60000;

const READ_NO_FOLLOW = constants.O_RDONLY | ('O_NOFOLLOW' in constants ? constants.O_NOFOLLOW : 0);

export { ARCHIVE_NAME, CONFINED_DIR, MINUTE_MS, READ_NO_FOLLOW };
