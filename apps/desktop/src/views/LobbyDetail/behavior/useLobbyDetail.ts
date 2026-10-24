/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { confirmAction, useKeyedGuard } from '@drizztdourden08/brock-react';
import type { AdminLobbyMember, HostTarget, ServerEntry } from '@archipelia/model';
import { failWith } from '../../../hooks/fail-with';
import { appApi } from '../../../ipc/app-api';
import { useServerPlace } from '../../../hooks/useServerPlace';
import type { LobbyRequest } from '../../../lobbies/lobbies.type';
import { lobbyRequest } from '../../../lobbies/lobby-request';
import { useLobbyStore } from '../../../stores/useLobbyStore';
import { FAILURE } from '../LobbyDetail.constants';
import type { ConsentRequest, LobbyDetailProps } from '../LobbyDetail.type';
import { consentOptions } from './consent-options';

const useLobbyDetail = ({ serverId, lobbyId }: LobbyDetailProps) => {
  const lobbies = useLobbyStore((state) => state.lobbies[serverId]);
  const load = useLobbyStore((state) => state.load);
  const act = useLobbyStore((state) => state.act);
  const place = useServerPlace(serverId);
  const { guard, isBusy, errorOf, lastError } = useKeyedGuard();
  const [opened, setOpened] = useState(false);
  const [machines, setMachines] = useState<ServerEntry[]>([]);

  const reload = useCallback(() => guard('load', failWith(FAILURE.load, () => load(serverId))), [guard, load, serverId]);
  useEffect(() => { void reload().finally(() => setOpened(true)); }, [reload]);
  useEffect(() => { void appApi().serversList().then(setMachines, () => undefined); }, []);

  const machineLabel = (room: HostTarget): string | undefined => (room.kind === 'remote' ? machines.find((entry) => entry.id === room.serverId)?.label : undefined);

  const run = useCallback(
    (key: string, sentence: string, request: LobbyRequest) => guard(key, failWith(sentence, () => act(serverId, request))),
    [act, guard, serverId],
  );

  const review = (request: ConsentRequest) => {
    const { sha256 } = request.world;
    void confirmAction(consentOptions(request, place.where)).then((allowed) => run(`consent:${sha256}`, FAILURE.consent, lobbyRequest.consent(lobbyId, sha256, allowed)));
  };

  const remove = (member: AdminLobbyMember) => {
    void confirmAction({
      title: `Remove ${member.displayName}?`, message: 'The player leaves the lobby and its slots stop counting.', confirmLabel: 'Remove player', variant: 'danger',
    }).then(async (confirmed) => {
      if (confirmed) await run(`remove:${member.id}`, FAILURE.remove, lobbyRequest.remove(lobbyId, member.id));
    });
  };

  const loadError = errorOf('load');
  return {
    lobby: lobbies?.find((entry) => entry.id === lobbyId),
    place,
    machineLabel,
    loading: !opened || isBusy('load'),
    loadError,
    actionError: lastError === loadError ? null : lastError,
    isBusy,
    reload,
    review,
    remove,
    lock: () => run('lock', FAILURE.lock, lobbyRequest.lock(lobbyId)),
    start: () => run('start', FAILURE.start, lobbyRequest.start(lobbyId)),
    close: () => run('close', FAILURE.close, lobbyRequest.close(lobbyId)),
    stopRoom: () => run('stopRoom', FAILURE.stopRoom, lobbyRequest.stopRoom(lobbyId)),
    approve: (memberId: string) => run(`approve:${memberId}`, FAILURE.approve, lobbyRequest.approve(lobbyId, memberId)),
    refuse: (memberId: string) => run(`refuse:${memberId}`, FAILURE.refuse, lobbyRequest.refuse(lobbyId, memberId)),
  };
};

export { useLobbyDetail };
