/* @layer renderer-app @kind component */
import { ItemList, ListDetailLayout, ListItemList, ListItemRow } from '@drizztdourden08/tessera/composites';
import type { ItemListRowParts, PanelContainerConfig } from '@drizztdourden08/tessera/composites';
import { EmptyState, Icon, Status } from '@drizztdourden08/tessera/primitives';
import type { LobbyServerEntry } from '@archipelia/model';
import { ErrorCallout } from '@archipelia/design';
import { LOCAL_SERVER } from '../../lobbies/lobbies.constants';
import { LIST_WIDTH, NO_SERVER, REMOTE_EMPTY } from './ArchipeliaServers.constants';
import { entryStatus } from './behavior/entry-status';
import { useArchipeliaServers } from './behavior/useArchipeliaServers';
import { LanList } from './sub-components/LanList';
import { LocalServerPanel } from './sub-components/LocalServerPanel';
import { RemoteServerForm } from './sub-components/RemoteServerForm';
import { RemoteServerPanel } from './sub-components/RemoteServerPanel';

const rowParts = (entry: LobbyServerEntry): ItemListRowParts => {
  const status = entryStatus(entry);
  return { icon: <Icon name="server" />, meta: entry.url, columns: [{ primary: <Status tone={status.tone}>{status.text}</Status>, align: 'end' }] };
};

const ArchipeliaServers = () => {
  const model = useArchipeliaServers();
  const { remote } = model;
  const picked = remote.entries.find((entry) => entry.id === remote.selected);

  const containers: PanelContainerConfig[] = [
    {
      title: 'This computer',
      content: (
        <ListItemList label="This computer">
          <ListItemRow icon={<Icon name="layers" />} name="This computer" meta="The lobby server inside Archipelia" selected={remote.selected === LOCAL_SERVER} onClick={() => remote.select(LOCAL_SERVER)} />
        </ListItemList>
      ),
    },
    {
      title: 'Remote servers',
      content: (
        <ItemList
          title="Remote servers"
          showTitle={false}
          items={remote.entries}
          getId={(entry) => entry.id}
          getName={(entry) => entry.label}
          render={rowParts}
          selectedId={remote.selected}
          onSelect={remote.select}
          create={(close) => <RemoteServerForm onAdd={remote.add} onClose={close} />}
          createLabel="Add server"
          onRename={remote.rename}
          onDelete={(id) => void remote.remove(id)}
          empty={REMOTE_EMPTY}
          filter={false}
        />
      ),
    },
    { title: 'Servers on your network', content: <LanList servers={model.lan} ap={model.ap} /> },
  ];

  const detail = remote.selected === LOCAL_SERVER
    ? <LocalServerPanel status={model.status} names={model.names} busy={model.applying} error={model.applyError} onApply={model.apply} onRefresh={() => void model.refresh()} />
    : picked && <RemoteServerPanel entry={picked} model={remote} test={remote.tests[picked.id]} />;

  return (
    <ListDetailLayout
      listContainers={containers}
      detail={detail}
      emptyDetail={<>{remote.error && <ErrorCallout message={remote.error} />}<EmptyState message={NO_SERVER} /></>}
      listLabel="Archipelia servers"
      detailLabel="server"
      listShowTitle={false}
      storageKey="archipelia-servers.list"
      listWidth={LIST_WIDTH.initial}
      minListWidth={LIST_WIDTH.min}
      maxListWidth={LIST_WIDTH.max}
    />
  );
};

export { ArchipeliaServers };
