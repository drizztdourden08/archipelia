/* @layer core @kind logic */
import { unzipSync } from 'fflate';
import { sha256Hex } from '@drizztdourden08/archipelia-lobby-protocol/node';
import type { LobbyRoomFile } from '@archipelia/model';
import { FILE_ID_PREFIX } from '../lobby.constants';
import { OUTPUT_SLOT, SKIPPED_OUTPUT } from './start.constants';
import type { Participant } from './start.type';

const roomFiles = (zip: Uint8Array | null, players: Participant[]): LobbyRoomFile[] => {
  if (!zip) return [];
  const entries = unzipSync(zip, { filter: (file) => OUTPUT_SLOT.test(file.name) && !SKIPPED_OUTPUT.test(file.name) });
  const files: LobbyRoomFile[] = [];
  for (const [entry, bytes] of Object.entries(entries).sort(([a], [b]) => a.localeCompare(b))) {
    const [, number, name] = OUTPUT_SLOT.exec(entry.split('/').pop() ?? entry) ?? [];
    const player = players[Number(number) - 1];
    if (!player || !name) continue;
    files.push({ fileId: `${FILE_ID_PREFIX}${files.length + 1}`, slot: player.slot.name, name, entry, size: bytes.length, sha256: sha256Hex(bytes) });
  }
  return files;
};

export { roomFiles };
