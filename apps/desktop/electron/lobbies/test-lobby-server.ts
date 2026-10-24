/* @layer electron-main @kind logic */
import type { SecretReader } from '@archipelia/hosts';
import type { LobbyServerTest } from '../../src/lobbies/lobbies.type';
import type { createLobbyServerStore } from './create-lobby-server-store';
import { tokenSecret } from '../../src/lobbies/token-secret';
import { MISSING_TOKEN } from './lobbies.constants';
import { testRemoteServer } from './remote/test-remote-server';

const testLobbyServer = async (store: ReturnType<typeof createLobbyServerStore>, secrets: SecretReader, id: string): Promise<LobbyServerTest> => {
  const entry = await store.require(id);
  const token = await secrets.get(tokenSecret(entry.id));
  const result: LobbyServerTest = token
    ? await testRemoteServer({ url: entry.url, token, ...(entry.certSha256 ? { certSha256: entry.certSha256 } : {}) })
    : { ok: false, message: MISSING_TOKEN };
  await store.put({ ...entry, lastTest: { at: Date.now(), ok: result.ok, message: result.message } });
  return result;
};

export { testLobbyServer };
