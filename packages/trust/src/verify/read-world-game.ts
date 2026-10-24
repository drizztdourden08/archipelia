/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { APWORLD_LIMITS, unzipCapped } from '@archipelia/model/zip';
import { strFromU8 } from 'fflate';
import { MANIFEST_FILE, MAX_MANIFEST_BYTES } from './read-world-game.constants';

const readWorldGame = (bytes: Uint8Array): string | null => {
  try {
    const { files } = unzipCapped(bytes, APWORLD_LIMITS, ({ name, size }) => MANIFEST_FILE.test(name) && size <= MAX_MANIFEST_BYTES);
    const [first] = Object.values(files);
    const manifest: unknown = first ? JSON.parse(strFromU8(first)) : null;
    return isRecord(manifest) && typeof manifest.game === 'string' ? manifest.game : null;
  } catch {
    return null;
  }
};

export { readWorldGame };
