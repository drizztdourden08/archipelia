/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import { useActiveServer } from '../../../hooks/useActiveServer';
import { appApi } from '../../../ipc/app-api';
import type { DirectOptions } from '../../../lobbies/lobbies.type';
import { lobbyRequest } from '../../../lobbies/lobby-request';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { DEFAULT_DIRECT, DISABLE_DIRECT } from '../SessionBuilder.constants';
import type { DirectDeps } from '../SessionBuilder.type';
import { withoutDirect } from './without-direct';

const useDirectSession = ({ draft, persist, guard }: DirectDeps) => {
  const { serverId, select } = useActiveServer();
  const act = useLobbyStore((state) => state.act);

  const enable = useCallback(() => guard('direct', async () => {
    const lobby = await act(serverId, lobbyRequest.open(draft, DEFAULT_DIRECT));
    await persist({ ...draft, direct: { serverId, lobbyId: lobby.id, ...DEFAULT_DIRECT } });
  }), [act, draft, guard, persist, serverId]);

  const disable = useCallback(() => guard('direct', async () => {
    const { direct } = draft;
    if (!direct || !(await confirmAction(DISABLE_DIRECT))) return;
    await appApi().lobbyClose({ templateId: draft.id, serverId: direct.serverId, lobbyId: direct.lobbyId });
    await persist(withoutDirect(draft));
  }), [act, draft, guard, persist]);

  const setOptions = useCallback((patch: Partial<DirectOptions>) => guard('direct', async () => {
    if (!draft.direct) return;
    const direct = { ...draft.direct, ...patch };
    await act(direct.serverId, lobbyRequest.update(direct.lobbyId, draft, direct));
    await persist({ ...draft, direct });
  }), [act, draft, guard, persist]);

  const moveTo = useCallback((next: string) => guard('direct', async () => {
    const { direct } = draft;
    select(next);
    if (!direct || direct.serverId === next) return;
    const lobby = await act(next, lobbyRequest.open(draft, direct));
    await persist({ ...draft, direct: { ...direct, serverId: next, lobbyId: lobby.id } });
    await appApi().lobbyClose({ templateId: draft.id, serverId: direct.serverId, lobbyId: direct.lobbyId });
  }), [act, draft, guard, persist, select]);

  return { enable, disable, setOptions, moveTo };
};

export { useDirectSession };
