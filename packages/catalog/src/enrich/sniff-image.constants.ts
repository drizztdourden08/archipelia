/* @layer core @kind config */

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const WEBP_LOSSY_START = Buffer.from([0x9d, 0x01, 0x2a]);

const PNG_MIN_BYTES = 24;

const PNG_AFTER_IHDR = 33;

const WEBP_MIN_BYTES = 30;

const WEBP_ANIMATION_FLAG = 0x02;

const WEBP_LOSSLESS_SIGNATURE = 0x2f;

const SIDE_MASK = 0x3fff;

export { PNG_AFTER_IHDR, PNG_MAGIC, PNG_MIN_BYTES, SIDE_MASK, WEBP_ANIMATION_FLAG, WEBP_LOSSLESS_SIGNATURE, WEBP_LOSSY_START, WEBP_MIN_BYTES };
