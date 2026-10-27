/* @layer tests @kind helper */

const ascii = (text: string): number[] => [...text].map((character) => character.charCodeAt(0));

const littleEndian = (value: number, count: number): number[] => Array.from({ length: count }, (_, index) => Math.floor(value / 2 ** (8 * index)) % 256);

const bigEndian = (value: number): number[] => littleEndian(value, 4).reverse();

const padded = (head: number[], length = 64): Uint8Array => {
  const bytes = new Uint8Array(Math.max(length, head.length));
  bytes.set(head);
  return bytes;
};

const pngBytes = (width: number, height: number): Uint8Array =>
  padded([0x89, ...ascii('PNG'), 0x0d, 0x0a, 0x1a, 0x0a, ...bigEndian(13), ...ascii('IHDR'), ...bigEndian(width), ...bigEndian(height), 8, 6]);

const riff = (fourcc: string, payload: number[]): Uint8Array =>
  padded([...ascii('RIFF'), ...littleEndian(payload.length + 12, 4), ...ascii('WEBP'), ...ascii(fourcc), ...littleEndian(payload.length, 4), ...payload]);

const webpLossy = (width: number, height: number): Uint8Array =>
  riff('VP8 ', [0, 0, 0, 0x9d, 0x01, 0x2a, ...littleEndian(width, 2), ...littleEndian(height, 2)]);

const webpLossless = (width: number, height: number): Uint8Array =>
  riff('VP8L', [0x2f, ...littleEndian((width - 1) + (height - 1) * 2 ** 14, 4)]);

const webpExtended = (width: number, height: number, animated = false): Uint8Array =>
  riff('VP8X', [animated ? 0x02 : 0, 0, 0, 0, ...littleEndian(width - 1, 3), ...littleEndian(height - 1, 3)]);

export { ascii, pngBytes, webpExtended, webpLossless, webpLossy };
