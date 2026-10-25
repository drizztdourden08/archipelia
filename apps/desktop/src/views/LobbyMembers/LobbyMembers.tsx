/* @layer renderer-app @kind component */
import { PanelContainer } from '@drizztdourden08/tessera/composites';
import { EmptyState, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { RESULT_PHASES } from './LobbyDetail.constants';
import type { LobbyDetailProps } from './LobbyDetail.type';
import { useLobbyDetail } from './behavior/useLobbyDetail';
import { HostPlayer } from '../HostPlayer';
import { LobbyHeader } from './sub-components/LobbyHeader';
import { LobbyMissing } from './sub-components/LobbyMissing';
import { MemberCard } from './sub-components/MemberCard';
import { ResultsPanel } from './sub-components/ResultsPanel';

const LobbyDetail = (props: LobbyDetailProps) => {
  const model = useLobbyDetail(props);
  const { lobby } = model;
  if (!lobby) return <LobbyMissing loading={model.loading} error={model.loadError} onRetry={() => void model.reload()} />;
  return (
    <Stack>
      {model.actionError && <ErrorCallout message={model.actionError} />}
      <LobbyHeader lobby={lobby} model={model} />
      <PanelContainer title={`Players · ${lobby.members.length}`}>
        <Stack gap="sm">
          {lobby.members.length === 0 && <EmptyState message="Nobody has joined yet. Give players the address and the code." />}
          {lobby.members.map((member) => <MemberCard key={member.id} lobby={lobby} member={member} model={model} />)}
        </Stack>
      </PanelContainer>
      {lobby.phase === 'open' && <HostPlayer serverId={props.serverId} lobbyId={props.lobbyId} />}
      {(RESULT_PHASES.includes(lobby.phase) || lobby.failure) && <ResultsPanel lobby={lobby} onThisComputer={model.place.local && lobby.options.room.kind === 'local'} />}
    </Stack>
  );
};

export { LobbyDetail };
