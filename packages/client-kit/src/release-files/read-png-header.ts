/* @layer client-kit @kind logic */
import type { ImageHeader } from './release-files.type';
import { PNG_HEADER_BYTES, PNG_SIGNATURE } from './release-files.constants';
import { hasAsciiAt } from './has-ascii-at';

const readPngHeader = (bytes: Uint8Array): ImageHeader | undefined => {
  if (bytes.length < PNG_HEADER_BYTES) return undefined;
  if (!PNG_SIGNATURE.every((value, index) => bytes[index] === value) || !hasAsciiAt(bytes, 12, 'IHDR')) return undefined;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { format: 'png', width: view.getUint32(16), height: view.getUint32(20), animated: false };
};

export { readPngHeader };
