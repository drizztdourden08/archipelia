/* @layer renderer-app @kind component */
import { ItemList } from '@drizztdourden08/tessera/composites';
import type { ItemListRowParts, ListItemColumn } from '@drizztdourden08/tessera/composites';
import { Icon, Stack, Status, Tag } from '@drizztdourden08/tessera/primitives';
import type { AdminLobby } from '@archipelia/model';
import { ErrorCallout } from '@archipelia/design';
import { LOBBY_PHASES } from '../../lobbies/lobby-statuses.constants';
import { EMPTY } from './LobbyList.constants';
import { lobbyMeta } from './behavior/lobby-meta';
import { useLobbyList } from './behavior/useLobbyList';
import { waitingCount } from './behavior/waiting-count';
import { ServerBar } from './sub-components/ServerBar';

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
      <ServerBar serverId={model.serverId} options={model.options} place={model.place} notice={model.notice} onSelect={model.select} />
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
