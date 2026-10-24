/* @layer core @kind logic */
import { zipEntries } from './zip-entries';
import { zipEntryBytes } from './zip-entry-bytes';
import type { UnzipPick, Unzipped, ZipLimits } from './zip.type';

const unzipCapped = (bytes: Uint8Array, limits: ZipLimits, pick: UnzipPick): Unzipped => {
  const entries = zipEntries(bytes, limits);
  const files: Record<string, Uint8Array> = {};
  for (const entry of entries) if (pick(entry)) files[entry.name] = zipEntryBytes(bytes, entry);
  return { names: entries.map((entry) => entry.name), files };
};

export { unzipCapped };
