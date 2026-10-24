/* @layer renderer-app @kind component */
import { ListItemList, ListItemRow } from '@drizztdourden08/tessera/composites';
import { Icon, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { LAN_TEXT, MATCH_LABEL } from '../../ArchipeliaServers.constants';
import { lanRows } from '../../behavior/lan-rows';
import type { LanListProps } from '../../ArchipeliaServers.type';

const LanList = ({ servers, ap }: LanListProps) => {
  const rows = lanRows(servers, ap);
  if (rows.length === 0) return <Text variant="caption" tone="dim">{LAN_TEXT.empty}</Text>;
  return (
    <ListItemList label="Servers on your network" count={rows.length}>
      {rows.map((row) => (
        <ListItemRow
          key={row.id}
          icon={<Icon name="server" />}
          name={row.self ? `${row.name} (${LAN_TEXT.self})` : row.name}
          meta={`${row.address} · Archipelago ${row.ap} · ${row.open ? LAN_TEXT.open : LAN_TEXT.closed}`}
          columns={[{ primary: <Tag variant="urgency" color={row.match === 'same' ? 'success' : 'warning'}>{MATCH_LABEL[row.match]}</Tag>, align: 'end' }]}
        />
      ))}
    </ListItemList>
  );
};

export { LanList };
