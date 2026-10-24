/* @layer client-kit @kind config */

const FIXED_TIME = new Date(1980, 0, 1, 0, 0, 0);

const DEFLATE_LEVEL = 9;

const UNIX_HOST = 3;

const FILE_MODE = 0o100644;

const FILE_ATTRIBUTES = (FILE_MODE << 16) >>> 0;

const MAX_MANIFEST_BYTES = 1024 * 1024;

export { DEFLATE_LEVEL, FILE_ATTRIBUTES, FIXED_TIME, MAX_MANIFEST_BYTES, UNIX_HOST };
