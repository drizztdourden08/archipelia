/* @layer renderer-app @kind component */
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import { ActionBar, CopyValue, FactsPanel } from '@drizztdourden08/tessera/composites';
import { Flex, Inline, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { LOBBY_PHASES } from '../../../../lobbies/lobby-statuses.constants';
import { headerActions } from '../../behavior/header-actions';
import { lobbyFacts } from '../../behavior/lobby-facts';
import type { LobbyHeaderProps } from './LobbyHeader.type';

const LobbyHeader = ({ lobby, model }: LobbyHeaderProps) => {
  const code = formatLobbyCode(lobby.code) ?? lobby.code;
  const { address } = model.place;
  const joining = [[
    { label: 'Lobby code', value: <CopyValue value={code} label="lobby code" mono /> },
    { label: 'Server address', value: address ? <CopyValue value={address} label="server address" mono /> : 'Not available' },
  ]];
  return (
    <Stack gap="sm">
      <Flex justify="between" align="center" wrap>
        <Inline gap="sm" align="center">
          <Text as="h2" variant="subtitle">{lobby.name}</Text>
          <Status map={LOBBY_PHASES} value={lobby.phase} dot />
        </Inline>
        <ActionBar label={`${lobby.name} actions`} actions={headerActions(lobby, model)} align="end" />
      </Flex>
      <FactsPanel label="How players join" groups={joining} layout="inline" />
      <FactsPanel label="Lobby settings" groups={[lobbyFacts(lobby, model.place.label, model.machineLabel(lobby.options.room))]} layout="boxed" />
    </Stack>
  );
};

export { LobbyHeader };
