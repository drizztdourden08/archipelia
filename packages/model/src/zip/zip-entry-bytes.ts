/* @layer core @kind logic */
import { inflateCapped } from './inflate-capped';
import { DEFLATED, LOCAL_BYTES, LOCAL_SIGNATURE, STORED } from './zip.constants';
import type { ZipEntry } from './zip.type';

const zipEntryBytes = (bytes: Uint8Array, entry: ZipEntry): Uint8Array => {
  const data = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (entry.offset + LOCAL_BYTES > data.byteLength || data.getUint32(entry.offset, true) !== LOCAL_SIGNATURE) throw new Error(`the zip entry ${entry.name} is damaged`);
  const start = entry.offset + LOCAL_BYTES + data.getUint16(entry.offset + 26, true) + data.getUint16(entry.offset + 28, true);
  const raw = bytes.subarray(start, start + entry.compressedSize);
  if (raw.length !== entry.compressedSize) throw new Error(`the zip entry ${entry.name} is cut short`);
  if (entry.method === DEFLATED) return inflateCapped(raw, entry.size, entry.name);
  if (entry.method !== STORED || raw.length !== entry.size) throw new Error(`the zip entry ${entry.name} uses an unknown compression`);
  return raw.slice();
};

export { zipEntryBytes };
