/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { useLobbyServerEntries } from '../../../hooks/useLobbyServerEntries';
import type { PlaceDeps, SessionPlace } from '../SessionBuilder.type';
import { placeOf } from './place-of';
import { placeOptions } from './place-options';
import { remoteOptions } from './remote-options';
import { remoteValue } from './remote-value';
import { withPlace } from './with-place';
import { withRemote } from './with-remote';

const useSessionPlace = ({ draft, servers, hosting, live, setDraft }: PlaceDeps) => {
  const { entries } = useLobbyServerEntries();
  const context = useMemo(() => ({ lobbyServers: entries, servers, hosting }), [entries, hosting, servers]);
  const choose = useCallback((next: SessionPlace) => setDraft((current) => withPlace(current, next, context)), [context, setDraft]);
  const pickRemote = useCallback((value: string) => setDraft((current) => withRemote(current, value, hosting)), [hosting, setDraft]);
  return {
    place: placeOf(draft),
    options: placeOptions({ draft, lobbyServers: entries, live }),
    remoteOptions: remoteOptions({ draft, lobbyServers: entries, servers }),
    remoteValue: remoteValue(draft),
    choose,
    pickRemote,
  };
};

export { useSessionPlace };
