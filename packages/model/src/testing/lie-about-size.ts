/* @layer core @kind logic */
import { CENTRAL_BYTES } from '../zip/zip.constants';

const lieAboutSize = (zip: Uint8Array, size: number, index = 0): Uint8Array => {
  const data = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  let at = data.getUint32(zip.byteLength - 22 + 16, true);
  for (let skipped = 0; skipped < index; skipped += 1) at += CENTRAL_BYTES + data.getUint16(at + 28, true) + data.getUint16(at + 30, true) + data.getUint16(at + 32, true);
  data.setUint32(at + 24, size, true);
  return zip;
};

export { lieAboutSize };
