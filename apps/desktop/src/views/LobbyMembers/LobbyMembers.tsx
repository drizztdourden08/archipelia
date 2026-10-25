/* @layer renderer-app @kind component */
import { PanelContainer } from '@drizztdourden08/tessera/composites';
import { EmptyState, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { EMPTY, SHOWN_ADMISSIONS } from './LobbyMembers.constants';
import type { LobbyMembersProps } from './LobbyMembers.type';
import { useLobbyMembers } from './behavior/useLobbyMembers';
import { MemberCard } from './sub-components/MemberCard';

const LobbyMembers = (props: LobbyMembersProps) => {
  const model = useLobbyMembers(props);
  const { lobby } = model;
  if (!lobby) return null;
  const clients = lobby.members.filter((member) => member.kind === 'client' && SHOWN_ADMISSIONS.includes(member.admission));
  return (
    <PanelContainer title={`Connected players · ${clients.length}`}>
      <Stack gap="sm">
        {model.actionError && <ErrorCallout message={model.actionError} />}
        {clients.length === 0 && <EmptyState message={EMPTY} />}
        {clients.map((member) => <MemberCard key={member.id} lobby={lobby} member={member} model={model} />)}
      </Stack>
    </PanelContainer>
  );
};

export { LobbyMembers };
