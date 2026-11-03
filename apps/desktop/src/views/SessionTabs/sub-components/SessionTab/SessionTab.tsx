/* @layer renderer-app @kind component */
import { useSavedTemplate } from '../../../../hooks/useSavedTemplate';
import { lobbyOfTab } from '../../../../live/lobby-of-tab';
import { runOfTab } from '../../../../live/run-of-tab';
import { tabPhaseOf } from '../../../../live/tab-phase-of';
import { ROOM_PHASES } from '../../../../live/tab-phase.constants';
import { useLobbyStore } from '../../../../stores/useLobbyStore';
import { useRunsStore } from '../../../../stores/useRunsStore';
import type { SessionTabProps } from '../../SessionTabs.type';
import { RoomStage } from '../RoomStage';
import { TabRoom } from '../TabRoom';
import { TemplateState } from '../TemplateState';

const SessionTab = ({ tab }: SessionTabProps) => {
  const saved = useSavedTemplate(tab.sessionId);
  const lobby = useLobbyStore((state) => lobbyOfTab(state.lobbies, tab));
  const run = useRunsStore((state) => runOfTab(state.runs, tab));
  const phase = tabPhaseOf(lobby, run);
  if (saved.template) return <RoomStage tab={tab} saved={saved.template} run={run} phase={phase} />;
  if (ROOM_PHASES.includes(phase)) return <TabRoom tab={tab} run={run} phase={phase} />;
  return <TemplateState tab={tab} saved={saved} />;
};

export { SessionTab };
