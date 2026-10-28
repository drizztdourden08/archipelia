/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { SessionDashboard } from '../../../SessionDashboard';
import { LobbyState } from '../../../SessionLobby';
import { TabResults } from '../TabResults';
import type { TabRoomProps } from './TabRoom.type';

const TabRoom = ({ tab, run, phase }: TabRoomProps) => (
  <Stack gap="md">
    {run ? <SessionDashboard sessionId={run.id} /> : <LobbyState serverId={tab.serverId} lobbyId={tab.lobbyId} direct={tab.direct} />}
    {phase === 'stopped' && run && <TabResults tab={tab} run={run} />}
  </Stack>
);

export { TabRoom };
