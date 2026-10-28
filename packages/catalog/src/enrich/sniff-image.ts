/* @layer core @kind logic */
import type { ImageInfo, ImageSize } from './enrich.type';
import {
  PNG_AFTER_IHDR, PNG_MAGIC, PNG_MIN_BYTES, SIDE_MASK, WEBP_ANIMATION_FLAG, WEBP_LOSSLESS_SIGNATURE, WEBP_LOSSY_START, WEBP_MIN_BYTES,
} from './sniff-image.constants';

const tagAt = (data: Buffer, at: number): string => data.toString('latin1', at, at + 4);

const pngOf = (data: Buffer): ImageInfo | undefined => {
  if (data.length < PNG_MIN_BYTES || !data.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC) || tagAt(data, 12) !== 'IHDR') return undefined;
  const animated = data.includes('acTL', PNG_AFTER_IHDR, 'latin1');
  return { type: 'image/png', width: data.readUInt32BE(16), height: data.readUInt32BE(20), animated };
};

const losslessOf = (data: Buffer): ImageSize | undefined => {
  if (data.readUInt8(20) !== WEBP_LOSSLESS_SIGNATURE) return undefined;
  const bits = data.readUInt32LE(21);
  return { width: 1 + (bits & SIDE_MASK), height: 1 + ((bits >>> 14) & SIDE_MASK) };
};

const lossyOf = (data: Buffer): ImageSize | undefined =>
  data.subarray(23, 26).equals(WEBP_LOSSY_START) ? { width: data.readUInt16LE(26) & SIDE_MASK, height: data.readUInt16LE(28) & SIDE_MASK } : undefined;

const extendedOf = (data: Buffer): ImageSize & { animated: boolean } => ({
  width: 1 + data.readUIntLE(24, 3),
  height: 1 + data.readUIntLE(27, 3),
  animated: (data.readUInt8(20) & WEBP_ANIMATION_FLAG) !== 0,
});

const plainOf = (data: Buffer, chunk: string): ImageSize | undefined => {
  if (chunk === 'VP8L') return losslessOf(data);
  return chunk === 'VP8 ' ? lossyOf(data) : undefined;
};

const webpOf = (data: Buffer): ImageInfo | undefined => {
  if (data.length < WEBP_MIN_BYTES || tagAt(data, 0) !== 'RIFF' || tagAt(data, 8) !== 'WEBP') return undefined;
  const chunk = tagAt(data, 12);
  if (chunk === 'VP8X') return { type: 'image/webp', ...extendedOf(data) };
  const size = plainOf(data, chunk);
  return size && { type: 'image/webp', ...size, animated: false };
};

const sniffImage = (bytes: Uint8Array): ImageInfo | undefined => {
  const data = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return pngOf(data) ?? webpOf(data);
};

export { sniffImage };
