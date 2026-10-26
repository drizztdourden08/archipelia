/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Callout, Inline, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { useLocalServerStatus } from '../../../../hooks/useLocalServerStatus';
import { useServerPlace } from '../../../../hooks/useServerPlace';
import { useSessionLobby } from '../../../../hooks/useSessionLobby';
import { LOBBY_PHASES } from '../../../../lobbies/lobby-statuses.constants';
import { LOBBY_TEXT } from '../../behavior/lobby-view.constants';
import { hasResults } from '../../behavior/has-results';
import { shownPhase } from '../../behavior/shown-phase';
import type { LobbyStateProps } from './LobbyState.type';
import { joinFacts } from '../../behavior/join-facts';
import { serverNotice } from '../../behavior/server-notice';
import { ResultsPanel } from '../ResultsPanel';

const LobbyState = ({ serverId, lobbyId, direct }: LobbyStateProps) => {
  const { lobby, loading, loadError, reload } = useSessionLobby(serverId, lobbyId);
  const place = useServerPlace(serverId);
  const { status } = useLocalServerStatus();
  const notice = serverNotice(place.local, status);
  if (loadError) return <ErrorCallout message={loadError} onRetry={() => void reload()} />;
  if (!lobby) return loading ? null : <Callout tone="warning">{LOBBY_TEXT.gone}</Callout>;
  return (
    <Stack gap="sm">
      <Inline gap="sm" align="center">
        <Text variant="label">{LOBBY_TEXT.lobby}</Text>
        <Status map={LOBBY_PHASES} value={shownPhase(lobby.phase, direct)} dot />
      </Inline>
      {notice && <Callout tone="warning">{notice}</Callout>}
      {direct && <FactsPanel label={LOBBY_TEXT.join} groups={[joinFacts(lobby, place.address)]} layout="inline" />}
      {lobby.phase === 'closed' && <Callout tone="info">{LOBBY_TEXT.ran}</Callout>}
      {hasResults(lobby) && <ResultsPanel lobby={lobby} onThisComputer={place.local && lobby.options.room.kind === 'local'} />}
    </Stack>
  );
};

export { LobbyState };
