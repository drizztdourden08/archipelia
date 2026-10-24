/* @layer core @kind logic */
import { sha256Hex } from '@drizztdourden08/archipelia-lobby-protocol/node';
import type { LobbyRoomFile } from '@archipelia/model';
import { zipEntries, zipEntryBytes } from '@archipelia/model/zip';
import { FILE_ID_PREFIX } from '../lobby.constants';
import { OUTPUT_SLOT, SKIPPED_OUTPUT } from './start.constants';
import type { Participant } from './start.type';

const roomFiles = (zip: Uint8Array | null, players: Participant[]): LobbyRoomFile[] => {
  if (!zip) return [];
  const wanted = zipEntries(zip).filter((entry) => OUTPUT_SLOT.test(entry.name) && !SKIPPED_OUTPUT.test(entry.name));
  const files: LobbyRoomFile[] = [];
  for (const entry of wanted.sort((a, b) => a.name.localeCompare(b.name))) {
    const [, number, name] = OUTPUT_SLOT.exec(entry.name.split('/').pop() ?? entry.name) ?? [];
    const player = players[Number(number) - 1];
    if (!player || !name) continue;
    const bytes = zipEntryBytes(zip, entry);
    files.push({ fileId: `${FILE_ID_PREFIX}${files.length + 1}`, slot: player.slot.name, name, entry: entry.name, size: bytes.length, sha256: sha256Hex(bytes) });
  }
  return files;
};

export { roomFiles };
