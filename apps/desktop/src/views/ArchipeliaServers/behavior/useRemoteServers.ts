/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import type { LobbyServerEntry } from '@archipelia/model';
import { failWith } from '../../../hooks/fail-with';
import { useLobbyServerEntries } from '../../../hooks/useLobbyServerEntries';
import { appApi } from '../../../ipc/app-api';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import type { LobbyServerTest } from '../../../lobbies/lobbies.type';
import { tokenSecret } from '../../../lobbies/token-secret';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { FAILURE } from '../ArchipeliaServers.constants';
import type { ServerDraft } from '../ArchipeliaServers.type';
import { newEntry } from './new-entry';
import { vaultOf } from './vault-failure';

const useRemoteServers = () => {
  const { entries, reload } = useLobbyServerEntries();
  const [selected, setSelected] = useState<string>(LOCAL_SERVER);
  const [tests, setTests] = useState<Record<string, LobbyServerTest>>({});
  const { guard, isBusy, errorOf, lastError } = useKeyedGuard();
  const forgetServer = useLobbyStore((state) => state.select);
  const activeServer = useLobbyStore((state) => state.serverId);

  const test = useCallback(async (id: string) => {
    const result = await appApi().lobbyServersTest(id);
    setTests((known) => ({ ...known, [id]: result }));
    await reload();
  }, [reload]);

  const add = useCallback(async (draft: ServerDraft): Promise<boolean> => {
    const done = await guard('save', failWith(FAILURE.save, async () => {
      const stored = await appApi().lobbyServersSave(newEntry(draft));
      await vaultOf().set(tokenSecret(stored.id), draft.token, `Admin token for ${stored.label}`);
      setSelected(stored.id);
      await test(stored.id);
      return true;
    }));
    return done === true;
  }, [guard, test]);

  const save = useCallback(async (entry: LobbyServerEntry) => {
    await appApi().lobbyServersSave(entry);
    await reload();
  }, [reload]);

  const rename = useCallback((id: string, label: string) => {
    const entry = entries.find((candidate) => candidate.id === id);
    if (entry) void guard(`rename:${id}`, failWith(FAILURE.rename, () => save({ ...entry, label })));
  }, [entries, guard, save]);

  const remove = useCallback((id: string) => guard(`remove:${id}`, failWith(FAILURE.remove, async () => {
    await appApi().lobbyServersRemove(id);
    await vaultOf().delete(tokenSecret(id));
    if (activeServer === id) forgetServer(LOCAL_SERVER);
    setSelected((current) => (current === id ? LOCAL_SERVER : current));
    await reload();
  })), [activeServer, forgetServer, guard, reload]);

  const trust = useCallback((entry: LobbyServerEntry, certSha256: string) => guard(`trust:${entry.id}`, failWith(FAILURE.trust, async () => {
    await save({ ...entry, certSha256 });
    await test(entry.id);
  })), [guard, save, test]);

  const replaceToken = useCallback((entry: LobbyServerEntry, token: string) => guard(`token:${entry.id}`, failWith(FAILURE.token, async () => {
    await vaultOf().set(tokenSecret(entry.id), token, `Admin token for ${entry.label}`);
    await save(entry);
    await test(entry.id);
  })), [guard, save, test]);

  const retest = useCallback((id: string) => guard(`test:${id}`, failWith(FAILURE.test, () => test(id))), [guard, test]);

  return { entries, selected, select: setSelected, tests, add, rename, remove, trust, replaceToken, retest, isBusy, error: lastError, errorOf };
};

export { useRemoteServers };
