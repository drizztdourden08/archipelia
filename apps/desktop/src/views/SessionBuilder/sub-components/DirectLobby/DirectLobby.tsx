/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Callout, Inline, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { useLocalServerStatus } from '../../../../hooks/useLocalServerStatus';
import { useServerPlace } from '../../../../hooks/useServerPlace';
import { useSessionLobby } from '../../../../hooks/useSessionLobby';
import { LOBBY_PHASES } from '../../../../lobbies/lobby-statuses.constants';
import { LOBBY_TEXT, RESULT_PHASES } from '../../behavior/lobby-view.constants';
import type { DirectLobbyProps } from './DirectLobby.type';
import { joinFacts } from '../../behavior/join-facts';
import { serverNotice } from '../../behavior/server-notice';
import { ResultsPanel } from '../ResultsPanel';

const DirectLobby = ({ serverId, lobbyId }: DirectLobbyProps) => {
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
        <Status map={LOBBY_PHASES} value={lobby.phase} dot />
      </Inline>
      {notice && <Callout tone="warning">{notice}</Callout>}
      <FactsPanel label={LOBBY_TEXT.lobby} groups={[joinFacts(lobby, place.address)]} layout="inline" />
      {lobby.phase === 'closed' && <Callout tone="info">{LOBBY_TEXT.ran}</Callout>}
      {(RESULT_PHASES.includes(lobby.phase) || lobby.failure) && <ResultsPanel lobby={lobby} onThisComputer={place.local && lobby.options.room.kind === 'local'} />}
    </Stack>
  );
};

export { DirectLobby };
