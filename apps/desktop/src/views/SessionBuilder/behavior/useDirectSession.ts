/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import { appApi } from '../../../ipc/app-api';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import type { DirectOptions } from '../../../lobbies/lobbies.type';
import { lobbyRequest } from '../../../lobbies/lobby-request';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { DEFAULT_DIRECT, DISABLE_DIRECT } from '../SessionBuilder.constants';
import type { DirectDeps } from '../SessionBuilder.type';
import { withoutDirect } from './without-direct';

const useDirectSession = ({ draft, setDraft, persist, guard, localHost }: DirectDeps) => {
  const act = useLobbyStore((state) => state.act);
  const apply = useLobbyStore((state) => state.apply);

  const enable = useCallback(() => setDraft((current) => ({ ...current, host: localHost(current.host), direct: { serverId: LOCAL_SERVER, ...DEFAULT_DIRECT } })), [localHost, setDraft]);

  const disable = useCallback(() => guard('direct', async () => {
    const { direct } = draft;
    if (!direct?.lobbyId) {
      setDraft(withoutDirect);
      return;
    }
    if (!(await confirmAction(DISABLE_DIRECT))) return;
    await appApi().lobbyClose({ templateId: draft.id, serverId: direct.serverId, lobbyId: direct.lobbyId });
    await persist(withoutDirect(draft));
  }), [draft, guard, persist, setDraft]);

  const setOptions = useCallback((patch: Partial<DirectOptions>) => guard('direct', async () => {
    if (!draft.direct) return;
    const direct = { ...draft.direct, ...patch };
    if (!direct.lobbyId) {
      setDraft((current) => ({ ...current, direct }));
      return;
    }
    await act(direct.serverId, lobbyRequest.update(direct.lobbyId, draft, direct));
    await persist({ ...draft, direct });
  }), [act, draft, guard, persist, setDraft]);

  const moveTo = useCallback((next: string) => guard('direct', async () => {
    if (!draft.direct || draft.direct.serverId === next) return;
    const { lobbyId, ...rest } = draft.direct;
    const moved = { ...draft, host: localHost(draft.host), direct: { ...rest, serverId: next } };
    if (!lobbyId) {
      setDraft(moved);
      return;
    }
    const lobby = await act(next, lobbyRequest.open(moved, rest));
    await persist({ ...moved, direct: { ...moved.direct, lobbyId: lobby.id } });
    await appApi().lobbyClose({ templateId: draft.id, serverId: rest.serverId, lobbyId });
  }), [act, draft, guard, localHost, persist, setDraft]);

  const open = useCallback(() => guard('lobby', async () => {
    const { direct } = draft;
    if (!direct) return;
    const lobby = await appApi().sessionsOpenDirect(draft);
    apply({ serverId: direct.serverId, lobby });
    await persist({ ...draft, direct: { ...direct, lobbyId: lobby.id } });
  }), [apply, draft, guard, persist]);

  return { enable, disable, setOptions, moveTo, open };
};

export { useDirectSession };
