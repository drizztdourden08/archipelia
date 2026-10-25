/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Callout, Inline, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { useLocalServerStatus } from '../../../../hooks/useLocalServerStatus';
import { useServerPlace } from '../../../../hooks/useServerPlace';
import { useSessionLobby } from '../../../../hooks/useSessionLobby';
import { LOBBY_PHASES } from '../../../../lobbies/lobby-statuses.constants';
import { RESULT_PHASES, TEXT } from '../../DirectConnection.constants';
import type { DirectLobbyProps } from './DirectLobby.type';
import { joinFacts } from '../../behavior/join-facts';
import { serverNotice } from '../../behavior/server-notice';
import { ResultsPanel } from '../ResultsPanel';

const DirectLobby = ({ direct }: DirectLobbyProps) => {
  const { lobby, loading, loadError, reload } = useSessionLobby(direct.serverId, direct.lobbyId);
  const place = useServerPlace(direct.serverId);
  const { status } = useLocalServerStatus();
  const notice = serverNotice(place.local, status);
  if (loadError) return <ErrorCallout message={loadError} onRetry={() => void reload()} />;
  if (!lobby) return loading ? null : <Callout tone="warning">{TEXT.gone}</Callout>;
  return (
    <Stack gap="sm">
      <Inline gap="sm" align="center">
        <Text variant="label">{TEXT.join}</Text>
        <Status map={LOBBY_PHASES} value={lobby.phase} dot />
      </Inline>
      {notice && <Callout tone="warning">{notice}</Callout>}
      <FactsPanel label={TEXT.join} groups={[joinFacts(lobby, place.address)]} layout="inline" />
      {lobby.phase === 'closed' && <Callout tone="info">{TEXT.ran}</Callout>}
      {(RESULT_PHASES.includes(lobby.phase) || lobby.failure) && <ResultsPanel lobby={lobby} onThisComputer={place.local && lobby.options.room.kind === 'local'} />}
    </Stack>
  );
};

export { DirectLobby };
