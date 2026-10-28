/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useDraftOfTab } from '../../../hooks/useDraftOfTab';
import { useNetworkView } from '../../../hooks/useNetworkView';
import { lobbyOfTab } from '../../../live/lobby-of-tab';
import type { LiveTab } from '../../../live/live.type';
import { runOfTab } from '../../../live/run-of-tab';
import { tabPhaseOf } from '../../../live/tab-phase-of';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { useSessionViewStore } from '../../../stores/useSessionViewStore';
import { EMPTY_SESSION_VIEW } from '../../../stores/session-view-store.constants';
import { useLobbyViewOfTab } from './useLobbyViewOfTab';

const useSessionViewFeed = (tab: LiveTab | undefined): void => {
  const { runs, loaded, failed, logs, loadLog } = useRunsStore();
  const lobbies = useLobbyStore((state) => state.lobbies);
  const run = tab ? runOfTab(runs, tab) : undefined;
  const id = run?.id ?? '';
  const lines = (id ? logs[id] : undefined) ?? EMPTY_SESSION_VIEW.lines;
  const tabLobby = tab ? lobbyOfTab(lobbies, tab) : undefined;
  const phase = tab ? tabPhaseOf(tabLobby, run) : null;
  const draft = useDraftOfTab(tab);
  const network = useNetworkView(draft, tab?.serverId ?? LOCAL_SERVER);
  const lobby = useLobbyViewOfTab(tab, draft, run === undefined);

  useEffect(() => { if (id) void loadLog(id); }, [id, loadLog]);

  useEffect(() => useSessionViewStore.getState().show({ session: run ?? null, lines, loaded, failed, phase, lobby, network }), [run, lines, loaded, failed, phase, lobby, network]);
};

export { useSessionViewFeed };
