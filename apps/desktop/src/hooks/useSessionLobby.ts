/* @layer renderer-app @kind hook */
import { useCallback, useEffect } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import type { AdminLobby } from '@archipelia/model';
import type { LobbyRequest } from '../lobbies/lobbies.type';
import { useLobbyStore } from '../stores/useLobbyStore';
import { failWith } from './fail-with';
import { LOBBY_LOAD_FAILED } from './lobby-hooks.constants';

const useSessionLobby = (serverId: string, lobbyId: string) => {
  const lobbies = useLobbyStore((state) => state.lobbies[serverId]);
  const load = useLobbyStore((state) => state.load);
  const act = useLobbyStore((state) => state.act);
  const { guard, isBusy, errorOf, lastError } = useKeyedGuard();

  const reload = useCallback(() => guard('load', failWith(LOBBY_LOAD_FAILED, () => load(serverId))), [guard, load, serverId]);
  useEffect(() => { void reload(); }, [reload]);

  const run = useCallback(
    (key: string, sentence: string, request: LobbyRequest): Promise<AdminLobby | undefined> => guard(key, failWith(sentence, () => act(serverId, request))),
    [act, guard, serverId],
  );

  const loadError = errorOf('load');
  return {
    lobby: lobbies?.find((entry) => entry.id === lobbyId),
    loading: isBusy('load'),
    loadError,
    actionError: lastError === loadError ? null : lastError,
    isBusy,
    reload,
    run,
  };
};

export { useSessionLobby };
