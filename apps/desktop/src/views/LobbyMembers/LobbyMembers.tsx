/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { CONNECTED_ADMISSIONS } from '../../lobbies/lobbies.constants';
import { EMPTY, HEADING } from './LobbyMembers.constants';
import type { LobbyMembersProps } from './LobbyMembers.type';
import { useLobbyMembers } from './behavior/useLobbyMembers';
import { MemberCard } from './sub-components/MemberCard';

const LobbyMembers = (props: LobbyMembersProps) => {
  const model = useLobbyMembers(props);
  const { lobby } = model;
  if (!lobby) return null;
  const clients = lobby.members.filter((member) => member.kind === 'client' && CONNECTED_ADMISSIONS.includes(member.admission));
  return (
    <Stack gap="sm">
      <Text variant="label">{`${HEADING} · ${clients.length}`}</Text>
      {model.actionError && <ErrorCallout message={model.actionError} />}
      {clients.length === 0 && <Text variant="caption" tone="dim">{EMPTY}</Text>}
      {clients.map((member) => <MemberCard key={member.id} lobby={lobby} member={member} model={model} />)}
    </Stack>
  );
};

export { LobbyMembers };
