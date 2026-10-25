/* @layer renderer-app @kind logic */
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import { MEMBER_EDITABLE_PHASES } from '../LobbyDetail.constants';
import type { MemberActions } from '../LobbyDetail.type';

const memberActions = (lobby: AdminLobby, member: AdminLobbyMember): MemberActions => {
  const editable = MEMBER_EDITABLE_PHASES.includes(lobby.phase);
  const pending = editable && member.admission === 'pending';
  return { approve: pending, refuse: pending, remove: editable && member.kind === 'client' && member.admission === 'approved' };
};

export { memberActions };
