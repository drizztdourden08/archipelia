/* @layer core @kind config */
import type { ZipLimits } from './zip.type';

const MIB = 1024 * 1024;

const ZIP_LIMITS: ZipLimits = { entries: 4096, entryBytes: 256 * MIB, totalBytes: 1024 * MIB };

const APWORLD_LIMITS: ZipLimits = { entries: 4096, entryBytes: 64 * MIB, totalBytes: 256 * MIB };

const END_SIGNATURE = 0x06054b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;

const END_BYTES = 22;
const CENTRAL_BYTES = 46;
const LOCAL_BYTES = 30;
const COMMENT_MAX = 65535;

const STORED = 0;
const DEFLATED = 8;

const INFLATE_SLICE = 4096;

export { APWORLD_LIMITS, CENTRAL_BYTES, CENTRAL_SIGNATURE, COMMENT_MAX, DEFLATED, END_BYTES, END_SIGNATURE, INFLATE_SLICE, LOCAL_BYTES, LOCAL_SIGNATURE, STORED, ZIP_LIMITS };
