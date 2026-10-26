/* @layer renderer-app @kind component */
import { Callout, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { LOBBY_TEXT } from '../../behavior/lobby-view.constants';
import { DirectLobby } from '../DirectLobby';
import { PlaceState } from '../PlaceState';
import type { JoinStateProps } from './JoinState.type';

const JoinState = ({ direct, place, closing }: JoinStateProps) => (
  <Stack gap="sm">
    {place.error && <ErrorCallout message={place.error} />}
    {closing && <Callout tone="warning">{LOBBY_TEXT.closing}</Callout>}
    <PlaceState direct={direct} place={place} />
    {direct?.lobbyId && <DirectLobby serverId={direct.serverId} lobbyId={direct.lobbyId} />}
    {direct && !direct.lobbyId && <Callout tone="info">{LOBBY_TEXT.notOpen}</Callout>}
  </Stack>
);

export { JoinState };
