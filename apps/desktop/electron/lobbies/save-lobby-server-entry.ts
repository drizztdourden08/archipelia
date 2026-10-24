/* @layer electron-main @kind logic */
import type { LobbyServerEntry } from '@archipelia/model';
import { newId } from '@drizztdourden08/brock-core/storage';
import { normalizePin } from '../../src/lobbies/normalize-pin';
import { tokenSecret } from '../../src/lobbies/token-secret';
import { checkLobbyServerEntry } from './check-lobby-server-entry';
import type { createLobbyServerStore } from './create-lobby-server-store';
import { NOT_LISTED } from './lobbies.constants';

const saveLobbyServerEntry = async (store: ReturnType<typeof createLobbyServerStore>, entry: LobbyServerEntry): Promise<LobbyServerEntry> => {
  checkLobbyServerEntry(entry);
  const existing = entry.id === '' ? null : await store.get(entry.id);
  if (entry.id !== '' && !existing) throw new Error(NOT_LISTED);
  const id = existing?.id ?? newId();
  return store.put({
    id,
    label: entry.label.trim(),
    url: entry.url.trim(),
    tokenRef: tokenSecret(id),
    ...(entry.certSha256 === undefined ? {} : { certSha256: normalizePin(entry.certSha256) }),
    ...(existing?.lastTest ? { lastTest: existing.lastTest } : {}),
  });
};

export { saveLobbyServerEntry };
