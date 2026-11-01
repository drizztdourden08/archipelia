/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { appApi } from '../../../ipc/app-api';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { OPTION_TEXT } from '../LobbyMembers.constants';
import type { MemberOptionsState, MemberOptionsTarget } from '../LobbyMembers.type';
import { memberSlotOptions } from './member-slot-options';

const useMemberOptions = ({ serverId, lobbyId, memberId, rev }: MemberOptionsTarget): MemberOptionsState => {
  const installed = useLibraryStore((state) => state.installed);
  const [state, setState] = useState<MemberOptionsState>({ status: 'loading' });
  useEffect(() => {
    let current = true;
    appApi().lobbyYaml(serverId, lobbyId, memberId).then(
      (sent) => { if (current) setState({ status: 'ready', slots: memberSlotOptions(sent, installed) }); },
      () => { if (current) setState({ status: 'failed', problem: OPTION_TEXT.failed }); },
    );
    return () => { current = false; };
  }, [serverId, lobbyId, memberId, rev, installed]);
  return state;
};

export { useMemberOptions };
