/* @layer renderer-app @kind component */
import { lobbyOfTab } from '../../../../live/lobby-of-tab';
import { runOfTab } from '../../../../live/run-of-tab';
import { tabPhaseOf } from '../../../../live/tab-phase-of';
import { ROOM_PHASES } from '../../../../live/tab-phase.constants';
import { useLobbyStore } from '../../../../stores/useLobbyStore';
import { useRunsStore } from '../../../../stores/useRunsStore';
import { SessionLobby } from '../../../SessionLobby';
import type { SessionTabProps } from '../../SessionTabs.type';
import { TabRoom } from '../TabRoom';

const SessionTab = ({ tab }: SessionTabProps) => {
  const lobby = useLobbyStore((state) => lobbyOfTab(state.lobbies, tab));
  const run = useRunsStore((state) => runOfTab(state.runs, tab));
  const phase = tabPhaseOf(lobby, run);
  return ROOM_PHASES.includes(phase) ? <TabRoom tab={tab} run={run} phase={phase} /> : <SessionLobby tab={tab} />;
};

export { SessionTab };
