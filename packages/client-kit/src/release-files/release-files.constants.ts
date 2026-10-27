/* @layer client-kit @kind config */

const MAX_THUMBNAIL_BYTES = 1024 * 1024;

const MAX_THUMBNAIL_SIDE = 1024;

const MAX_DESCRIPTION_BYTES = 64 * 1024;

const PNG_SIGNATURE: readonly number[] = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const PNG_HEADER_BYTES = 24;

const WEBP_HEADER_BYTES = 30;

const WEBP_ANIMATION_FLAG = 0x02;

const HTML_TAG = /<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?\/?>|<!--/;

const CODE_SPANS = /```[\s\S]*?```|`[^`\n]*`/g;

export { CODE_SPANS, HTML_TAG, MAX_DESCRIPTION_BYTES, MAX_THUMBNAIL_BYTES, MAX_THUMBNAIL_SIDE, PNG_HEADER_BYTES, PNG_SIGNATURE, WEBP_ANIMATION_FLAG, WEBP_HEADER_BYTES };
