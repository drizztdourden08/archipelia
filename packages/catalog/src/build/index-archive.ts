/* @layer core @kind logic */
import { zipEntries } from '@archipelia/model/zip';
import type { ArchiveEntry } from './build.type';
import { ARCHIVE_LIMITS } from './build.constants';
import { entryParts } from './entry-parts';

const layoutError = () => new Error('The source archive does not hold one project folder, so Archipelia will not unpack it.');

const indexArchive = (bytes: Uint8Array): ArchiveEntry[] => {
  const found = zipEntries(bytes, ARCHIVE_LIMITS).map((entry) => ({ entry, ...entryParts(entry.name) }));
  const top = found[0]?.parts[0];
  const seen = new Set<string>();
  const indexed: ArchiveEntry[] = [];
  for (const { entry, parts, folder } of found) {
    if (parts[0] !== top || (parts.length === 1 && !folder)) throw layoutError();
    const rest = parts.slice(1);
    const key = rest.join('/').toLowerCase();
    if (rest.length === 0) continue;
    if (seen.has(key)) throw new Error('The source archive holds the same path twice, so Archipelia will not unpack it.');
    seen.add(key);
    indexed.push({ entry, parts: rest, folder });
  }
  return indexed;
};

export { indexArchive };
