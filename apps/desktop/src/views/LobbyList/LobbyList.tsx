/* @layer renderer-app @kind component */
import { ItemList } from '@drizztdourden08/tessera/composites';
import type { ItemListRowParts, ListItemColumn } from '@drizztdourden08/tessera/composites';
import { Callout, Icon, Stack, Status, Tag } from '@drizztdourden08/tessera/primitives';
import type { AdminLobby } from '@archipelia/model';
import { ErrorCallout } from '@archipelia/design';
import { LOBBY_PHASES } from '../../lobbies/lobby-statuses.constants';
import { EMPTY } from './LobbyList.constants';
import { lobbyMeta } from './behavior/lobby-meta';
import { useLobbyList } from './behavior/useLobbyList';
import { waitingCount } from './behavior/waiting-count';
import { HostChoice } from '../HostChoice';
import { JoinLobby } from '../JoinLobby';

const columnsOf = (lobby: AdminLobby): ListItemColumn[] => {
  const waiting = waitingCount(lobby);
  const count = lobby.members.length;
  return [
    { primary: <Status map={LOBBY_PHASES} value={lobby.phase} dot />, align: 'end' },
    {
      primary: `${count} ${count === 1 ? 'player' : 'players'}`,
      ...(waiting > 0 ? { secondary: <Tag variant="urgency" color="warning">{`${waiting} waiting`}</Tag> } : {}),
      align: 'end',
    },
  ];
};

const rowParts = (lobby: AdminLobby): ItemListRowParts => ({ icon: <Icon name="users" />, meta: lobbyMeta(lobby), columns: columnsOf(lobby) });

const LobbyList = () => {
  const model = useLobbyList();
  return (
    <Stack>
      <HostChoice />
      {model.notice && <Callout tone="warning">{model.notice}</Callout>}
      <JoinLobby />
      {model.error && <ErrorCallout message={model.error} onRetry={() => void model.reload()} />}
      {!model.error && (
        <ItemList
          title="Lobbies"
          items={model.lobbies}
          getId={(lobby) => lobby.id}
          getName={(lobby) => lobby.name}
          render={rowParts}
          onActivate={model.open}
          loading={model.loading}
          empty={EMPTY}
        />
      )}
    </Stack>
  );
};

export { LobbyList };
