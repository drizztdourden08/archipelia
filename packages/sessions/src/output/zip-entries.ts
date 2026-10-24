/* @layer core @kind logic */
import { CENTRAL_BYTES, CENTRAL_SIGNATURE, COMMENT_MAX, END_BYTES, END_SIGNATURE, ZIP_LIMITS } from './zip.constants';
import type { ZipEntry, ZipLimits } from './zip.type';

const findEnd = (data: DataView): number => {
  const lowest = Math.max(0, data.byteLength - END_BYTES - COMMENT_MAX);
  for (let at = data.byteLength - END_BYTES; at >= lowest; at -= 1) {
    if (data.getUint32(at, true) === END_SIGNATURE) return at;
  }
  throw new Error('the zip has no central directory');
};

const entryAt = (bytes: Uint8Array, data: DataView, at: number): { entry: ZipEntry; next: number } => {
  if (at + CENTRAL_BYTES > data.byteLength || data.getUint32(at, true) !== CENTRAL_SIGNATURE) throw new Error('the zip central directory is damaged');
  const nameLength = data.getUint16(at + 28, true);
  const entry = {
    name: new TextDecoder().decode(bytes.subarray(at + CENTRAL_BYTES, at + CENTRAL_BYTES + nameLength)),
    method: data.getUint16(at + 10, true),
    compressedSize: data.getUint32(at + 20, true),
    size: data.getUint32(at + 24, true),
    offset: data.getUint32(at + 42, true),
  };
  return { entry, next: at + CENTRAL_BYTES + nameLength + data.getUint16(at + 30, true) + data.getUint16(at + 32, true) };
};

const zipEntries = (bytes: Uint8Array, limits: ZipLimits = ZIP_LIMITS): ZipEntry[] => {
  const data = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const end = findEnd(data);
  const count = data.getUint16(end + 10, true);
  if (count > limits.entries) throw new Error(`the zip holds more than ${limits.entries} entries`);
  const entries: ZipEntry[] = [];
  let at = data.getUint32(end + 16, true);
  let total = 0;
  for (let index = 0; index < count; index += 1) {
    const { entry, next } = entryAt(bytes, data, at);
    total += entry.size;
    if (entry.size > limits.entryBytes || total > limits.totalBytes) throw new Error(`the zip entry ${entry.name} is larger than this server takes`);
    entries.push(entry);
    at = next;
  }
  return entries;
};

export { zipEntries };
