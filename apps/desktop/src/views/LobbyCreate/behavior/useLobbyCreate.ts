/* @layer renderer-app @kind hook */
import { useEffect, useMemo, useState } from 'react';
import { nav, useKeyedGuard, useSettings } from '@drizztdourden08/brock-react';
import type { ServerEntry } from '@archipelia/model';
import { failWith } from '../../../hooks/fail-with';
import { openLobby } from '../../../hooks/open-lobby';
import { useActiveServer } from '../../../hooks/useActiveServer';
import { useLocalServerStatus } from '../../../hooks/useLocalServerStatus';
import { ROUTE } from '../../../hooks/app-navigation.constants';
import { appApi } from '../../../ipc/app-api';
import type { LobbyDraft, LobbyServerView } from '../../../lobbies/lobbies.type';
import { lobbyRequest } from '../../../lobbies/lobby-request';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import type { AppSettings } from '../../../settings.type';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { FAILURE, PRIVATE_NOTE } from '../LobbyCreate.constants';
import { createRows } from './create-rows';
import { draftProblems } from './draft-problems';
import { newDraft } from './new-draft';

const useLobbyCreate = () => {
  const { settings } = useSettings<AppSettings>();
  const { serverId, entries } = useActiveServer();
  const act = useLobbyStore((state) => state.act);
  const defaults = useMemo(() => ({ port: settings.hostingLocalPort, ggBaseUrl: settings.ggBaseUrl }), [settings.hostingLocalPort, settings.ggBaseUrl]);
  const [draft, setDraft] = useState<LobbyDraft>(() => newDraft(defaults));
  const [attempted, setAttempted] = useState(false);
  const [view, setView] = useState<LobbyServerView | null>(null);
  const [machines, setMachines] = useState<ServerEntry[]>([]);
  const { guard, isBusy, errorOf } = useKeyedGuard();
  const { status } = useLocalServerStatus();

  useEffect(() => {
    setView(null);
    void guard('view', failWith(FAILURE.view, async () => { setView(await appApi().lobbyServerView(serverId)); }));
  }, [guard, serverId]);
  useEffect(() => { void appApi().serversList().then(setMachines, () => undefined); }, []);

  const local = serverId === LOCAL_SERVER;
  const label = local ? 'this computer' : (entries.find((entry) => entry.id === serverId)?.label ?? 'the server');
  const problems = draftProblems(draft);
  const shown = attempted ? problems : [];

  const isPrivate = serverId === LOCAL_SERVER && status?.options.mode === 'off';

  const create = () => {
    setAttempted(true);
    if (problems.length > 0 || (view && !view.engine)) return;
    void guard('create', failWith(FAILURE.create, async () => {
      const lobby = await act(serverId, lobbyRequest.create(draft));
      openLobby(serverId, lobby.id);
    }));
  };

  return {
    label,
    note: isPrivate ? PRIVATE_NOTE : null,
    rows: createRows({ draft, view, machines, defaults, local, problems: shown, onDraft: setDraft }),
    busy: isBusy('create'),
    error: errorOf('create') ?? errorOf('view'),
    create,
    cancel: () => nav.open(ROUTE.lobbies),
  };
};

export { useLobbyCreate };
