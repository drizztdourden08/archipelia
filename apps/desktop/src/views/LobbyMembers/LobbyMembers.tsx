/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { CONNECTED_ADMISSIONS } from '../../lobbies/lobbies.constants';
import type { LobbyMembersProps } from './LobbyMembers.type';
import { useLobbyMembers } from './behavior/useLobbyMembers';
import { MemberSeat } from './sub-components/MemberSeat';
import './LobbyMembers.css';

const LobbyMembers = (props: LobbyMembersProps) => {
  const model = useLobbyMembers(props);
  const { lobby } = model;
  if (!lobby) return null;
  const clients = lobby.members.filter((member) => member.kind === 'client' && CONNECTED_ADMISSIONS.includes(member.admission));
  return (
    <>
      {model.actionError && <Box className="lobby-members__error"><ErrorCallout message={model.actionError} /></Box>}
      {clients.map((member) => <MemberSeat key={member.id} lobby={lobby} member={member} model={model} />)}
    </>
  );
};

export { LobbyMembers };
