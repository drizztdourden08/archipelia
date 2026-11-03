/* @layer renderer-app @kind component */
import { LobbyStage } from '@archipelia/design';
import { Box } from '@drizztdourden08/tessera/primitives';
import { ROOM_PHASES } from '../../../../live/tab-phase.constants';
import { RunStage } from '../../../SessionDashboard';
import { LobbyState, SessionLobby } from '../../../SessionLobby';
import { TabResults } from '../TabResults';
import type { RoomStageProps } from './RoomStage.type';

const RoomStage = ({ tab, saved, run, phase }: RoomStageProps) => {
  const room = ROOM_PHASES.includes(phase);
  return (
    <SessionLobby tab={tab} saved={saved}>
      {(lobbyStage) => (
        <RunStage sessionId={run?.id ?? ''}>
          {(runStage) => {
            const running = room && runStage !== null;
            const { children: content, ...frame } = running ? runStage : lobbyStage;
            const body = room && !run
              ? <LobbyState serverId={tab.serverId} lobbyId={tab.lobbyId} direct={tab.direct} />
              : content;
            return (
              <Box className={running ? 'session-dashboard' : 'session-lobby'}>
                <LobbyStage {...frame}>
                  {body}
                  {phase === 'stopped' && run && <TabResults tab={tab} run={run} />}
                </LobbyStage>
              </Box>
            );
          }}
        </RunStage>
      )}
    </SessionLobby>
  );
};

export { RoomStage };
