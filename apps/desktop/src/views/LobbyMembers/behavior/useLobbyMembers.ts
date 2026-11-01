/* @layer renderer-app @kind hook */
import { useState } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import type { AdminLobbyMember } from '@archipelia/model';
import { useServerPlace } from '../../../hooks/useServerPlace';
import { useSessionLobby } from '../../../hooks/useSessionLobby';
import { lobbyRequest } from '../../../lobbies/lobby-request';
import { FAILURE } from '../LobbyMembers.constants';
import type { ConsentRequest, LobbyMembersProps } from '../LobbyMembers.type';
import { consentOptions } from './consent-options';

const useLobbyMembers = ({ serverId, lobbyId }: LobbyMembersProps) => {
  const session = useSessionLobby(serverId, lobbyId);
  const place = useServerPlace(serverId);
  const { run } = session;
  const [viewing, setViewing] = useState<string | null>(null);

  const review = (request: ConsentRequest) => {
    const { sha256 } = request.world;
    void confirmAction(consentOptions(request, place.where)).then((allowed) => run(`consent:${sha256}`, FAILURE.consent, lobbyRequest.consent(lobbyId, sha256, allowed)));
  };

  const remove = (member: AdminLobbyMember) => {
    void confirmAction({
      title: `Remove ${member.displayName}?`, message: 'The player leaves the session and its slots stop counting.', confirmLabel: 'Remove player', variant: 'danger',
    }).then(async (confirmed) => {
      if (confirmed) await run(`remove:${member.id}`, FAILURE.remove, lobbyRequest.remove(lobbyId, member.id));
    });
  };

  return {
    lobby: session.lobby,
    actionError: session.actionError,
    isBusy: session.isBusy,
    review,
    remove,
    viewing,
    viewOptions: (member: AdminLobbyMember) => setViewing(member.id),
    closeOptions: () => setViewing(null),
    approve: (memberId: string) => run(`approve:${memberId}`, FAILURE.approve, lobbyRequest.approve(lobbyId, memberId)),
    refuse: (memberId: string) => run(`refuse:${memberId}`, FAILURE.refuse, lobbyRequest.refuse(lobbyId, memberId)),
  };
};

export { useLobbyMembers };
