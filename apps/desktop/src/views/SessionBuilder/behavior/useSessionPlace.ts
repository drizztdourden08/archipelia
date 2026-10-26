/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import { useConnectedCount } from '../../../hooks/useConnectedCount';
import { useLobbyServerEntries } from '../../../hooks/useLobbyServerEntries';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import type { PlaceDeps, SessionPlace } from '../SessionBuilder.type';
import { hostOfKind } from './host-of-kind';
import { hostOfValue } from './host-of-value';
import { LOBBY_PREFIX, OPEN_LAN } from './place.constants';
import { placeOf } from './place-of';
import { placeOptions } from './place-options';
import { remoteHost } from './remote-host';
import { remoteOptions } from './remote-options';
import { remoteValue } from './remote-value';
import { useNetworkMode } from './useNetworkMode';

const useSessionPlace = ({ draft, servers, hosting, setHost, moveTo }: PlaceDeps) => {
  const { entries } = useLobbyServerEntries();
  const network = useNetworkMode();
  const connected = useConnectedCount(draft.direct);
  const { direct } = draft;
  const { mode, setMode } = network;

  const toLocal = useCallback(() => {
    if (direct && direct.serverId !== LOCAL_SERVER) moveTo(LOCAL_SERVER);
    else setHost((host) => hostOfKind('local', host, [], hosting));
  }, [direct, hosting, moveTo, setHost]);

  const chooseRemote = useCallback(() => {
    const first = entries[0];
    if (!direct) setHost((host) => remoteHost(host, servers, hosting.ggBaseUrl));
    else if (first) moveTo(first.id);
  }, [direct, entries, hosting.ggBaseUrl, moveTo, servers, setHost]);

  const chooseHere = useCallback(async (lan: boolean) => {
    const open = mode !== undefined && mode !== 'off';
    if (lan && !open && !(await confirmAction(OPEN_LAN))) return;
    toLocal();
    if (direct && lan !== open) await setMode(lan ? 'lan' : 'off');
  }, [direct, mode, setMode, toLocal]);

  const choose = useCallback((next: SessionPlace) => {
    if (next === 'remote') chooseRemote();
    else void chooseHere(next === 'lan');
  }, [chooseHere, chooseRemote]);

  const pickRemote = useCallback((value: string) => {
    if (value.startsWith(LOBBY_PREFIX)) moveTo(value.slice(LOBBY_PREFIX.length));
    else setHost(() => hostOfValue(value, hosting.ggBaseUrl));
  }, [hosting.ggBaseUrl, moveTo, setHost]);

  const view = useMemo(() => ({ draft, lobbyServers: entries, connected, servers }), [connected, draft, entries, servers]);
  const place = placeOf(draft, mode);
  return {
    place, entries, status: network.status, busy: network.busy, error: network.error,
    options: placeOptions(view), remoteOptions: remoteOptions(view), remoteValue: remoteValue(draft),
    stillOpen: direct !== undefined && place === 'remote' && mode !== undefined && mode !== 'off',
    choose, pickRemote, stop: () => void setMode('off'),
  };
};

export { useSessionPlace };
