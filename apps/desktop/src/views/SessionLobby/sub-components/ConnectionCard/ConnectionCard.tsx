/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Callout, Card, SectionHeader, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { TOUR_TARGET } from '../../../../hooks/tour-targets.constants';
import { CONNECTION_TEXT, LOBBY_TEXT } from '../../behavior/lobby-view.constants';
import { useConnection } from '../../behavior/useConnection';
import { LobbyState } from '../LobbyState';
import { NetworkState } from '../NetworkState';
import { RemoteState } from '../RemoteState';
import type { ConnectionCardProps } from './ConnectionCard.type';

const ConnectionCard = ({ template }: ConnectionCardProps) => {
  const link = useConnection(template);
  const lobbyId = template.lobby?.lobbyId;
  return (
    <Card data-tour={TOUR_TARGET.lobbyConnection}>
      <Stack gap="sm">
        <SectionHeader title={CONNECTION_TEXT.heading} subtitle={CONNECTION_TEXT[link.reach]} />
        {link.error && <ErrorCallout message={link.error} />}
        {link.closing && <Callout tone="warning">{LOBBY_TEXT.closing}</Callout>}
        {link.reach === 'archipelia' && <RemoteState serverId={link.serverId} stillOpen={link.open} busy={link.busy} onStop={link.stop} />}
        {link.localStatus && <NetworkState open={link.open} status={link.localStatus} busy={link.busy} onStop={link.stop} />}
        {link.facts.length > 0 && <FactsPanel label={CONNECTION_TEXT.room} groups={[link.facts]} layout="boxed" />}
        {lobbyId && <LobbyState serverId={link.serverId} lobbyId={lobbyId} direct={template.direct !== undefined} />}
      </Stack>
    </Card>
  );
};

export { ConnectionCard };
