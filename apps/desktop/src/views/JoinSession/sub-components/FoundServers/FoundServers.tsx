/* @layer renderer-app @kind component */
import { ListItemList, ListItemRow } from '@drizztdourden08/tessera/composites';
import { Icon, Text } from '@drizztdourden08/tessera/primitives';
import { TEXT } from '../../JoinSession.constants';
import type { FoundServersProps } from '../../JoinSession.type';

const FoundServers = ({ servers, looking, selected, onPick }: FoundServersProps) => {
  if (!looking) return <Text variant="caption" tone="dim">{TEXT.notLooking}</Text>;
  if (servers.length === 0) return <Text variant="caption" tone="dim">{`${TEXT.looking} ${TEXT.empty}`}</Text>;
  return (
    <ListItemList label="Servers on your network" count={servers.length}>
      {servers.map((server) => {
        const address = `${server.host}:${server.port}`;
        return (
          <ListItemRow
            key={server.id}
            icon={<Icon name="server" />}
            name={server.name}
            meta={`${address} · Archipelago ${server.ap} · ${server.open ? TEXT.open : TEXT.closed}`}
            selected={selected.trim() === address}
            onClick={() => onPick(server)}
          />
        );
      })}
    </ListItemList>
  );
};

export { FoundServers };
