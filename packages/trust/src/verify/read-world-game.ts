/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { strFromU8, unzipSync } from 'fflate';
import { MANIFEST_FILE, MAX_MANIFEST_BYTES } from './read-world-game.constants';

const readWorldGame = (bytes: Uint8Array): string | null => {
  try {
    const found = unzipSync(bytes, { filter: ({ name, originalSize }) => MANIFEST_FILE.test(name) && originalSize <= MAX_MANIFEST_BYTES });
    const [first] = Object.values(found);
    const manifest: unknown = first ? JSON.parse(strFromU8(first)) : null;
    return isRecord(manifest) && typeof manifest.game === 'string' ? manifest.game : null;
  } catch {
    return null;
  }
};

export { readWorldGame };
