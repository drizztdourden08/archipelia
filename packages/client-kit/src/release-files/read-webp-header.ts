/* @layer client-kit @kind logic */
import type { ImageHeader } from './release-files.type';
import { WEBP_ANIMATION_FLAG, WEBP_HEADER_BYTES } from './release-files.constants';
import { hasAsciiAt } from './has-ascii-at';
import { FOURCC_AT } from './read-webp-header.constants';

const littleEndian = (bytes: Uint8Array, offset: number, count: number): number =>
  Array.from({ length: count }, (_, index) => (bytes[offset + index] ?? 0) * 2 ** (8 * index)).reduce((sum, part) => sum + part, 0);

const extended = (bytes: Uint8Array): ImageHeader => ({
  format: 'webp',
  width: 1 + littleEndian(bytes, 24, 3),
  height: 1 + littleEndian(bytes, 27, 3),
  animated: ((bytes[20] ?? 0) & WEBP_ANIMATION_FLAG) !== 0,
});

const lossy = (bytes: Uint8Array): ImageHeader | undefined => {
  if (bytes[23] !== 0x9d || bytes[24] !== 0x01 || bytes[25] !== 0x2a) return undefined;
  return { format: 'webp', width: littleEndian(bytes, 26, 2) & 0x3fff, height: littleEndian(bytes, 28, 2) & 0x3fff, animated: false };
};

const lossless = (bytes: Uint8Array): ImageHeader | undefined => {
  if (bytes[20] !== 0x2f) return undefined;
  const bits = littleEndian(bytes, 21, 4);
  return { format: 'webp', width: 1 + (bits & 0x3fff), height: 1 + ((bits >>> 14) & 0x3fff), animated: false };
};

const readWebpHeader = (bytes: Uint8Array): ImageHeader | undefined => {
  if (bytes.length < WEBP_HEADER_BYTES || !hasAsciiAt(bytes, 0, 'RIFF') || !hasAsciiAt(bytes, 8, 'WEBP')) return undefined;
  if (hasAsciiAt(bytes, FOURCC_AT, 'VP8X')) return extended(bytes);
  if (hasAsciiAt(bytes, FOURCC_AT, 'VP8 ')) return lossy(bytes);
  return hasAsciiAt(bytes, FOURCC_AT, 'VP8L') ? lossless(bytes) : undefined;
};

export { readWebpHeader };
