/* @layer renderer-app @kind component */
import type { ServerEntry } from '@archipelia/model';
import { SearchAnchor } from '@drizztdourden08/brock-react';
import { InlineCreateForm, ListDetail } from '@drizztdourden08/tessera/composites';
import type { ItemListRowParts } from '@drizztdourden08/tessera/composites';
import { EmptyState, Icon, Stack, Status } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { LIST, NO_SERVER_TEXT } from './ServerManager.constants';
import { rowId } from './behavior/row-id';
import { rowName } from './behavior/row-name';
import { serverAnchor } from './behavior/server-anchor';
import { serverMeta } from './behavior/server-meta';
import { testStatus } from './behavior/test-status';
import { useServerManager } from './behavior/useServerManager';
import { ServerEditor } from './sub-components/ServerEditor';

const rowParts = (entry: ServerEntry): ItemListRowParts => {
  const status = testStatus(entry);
  const icon = <Icon name="server" />;
  return {
    icon: entry.id ? <SearchAnchor anchor={serverAnchor(entry.id)}>{icon}</SearchAnchor> : icon,
    meta: serverMeta(entry),
    columns: [{ primary: <Status tone={status.tone}>{status.text}</Status>, align: 'end' }],
  };
};

const ServerManager = () => {
  const manager = useServerManager();
  const { draft } = manager;
  return (
    <ListDetail
      list={{
        title: LIST.title,
        items: manager.rows,
        getId: rowId,
        getName: rowName,
        render: rowParts,
        create: (close) => (
          <InlineCreateForm label={LIST.nameLabel} placeholder={LIST.nameLabel} submitLabel={LIST.submit}
            onCreate={(label) => manager.create(label, close)} onCancel={close} />
        ),
        createLabel: LIST.add,
        onRename: manager.rename,
        onDelete: manager.removeRow,
        empty: LIST.empty,
      }}
      selectedId={manager.selectedId}
      onSelect={manager.pick}
      dirty={manager.dirty}
      onSave={manager.save}
      onDiscard={manager.discard}
      storageKey={LIST.width}
      detail={draft && <ServerEditor draft={draft} manager={manager} />}
      emptyDetail={(
        <Stack>
          {manager.error && <ErrorCallout message={manager.error} />}
          <EmptyState message={NO_SERVER_TEXT} />
        </Stack>
      )}
    />
  );
};

export { ServerManager };
