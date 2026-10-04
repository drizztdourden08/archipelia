/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { DropdownMenu, ListItemRow } from '@drizztdourden08/tessera/composites';
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Tag } from '@drizztdourden08/tessera/primitives';
import type { SessionRowProps } from './SessionRow.type';

const SessionRow = ({ id, name, meta, playersLabel, busy, onEdit, onRun, onDuplicate, onDelete }: SessionRowProps) => {
  const edit = useCallback(() => onEdit(id), [id, onEdit]);
  const run = useCallback(() => onRun(id), [id, onRun]);
  const more = useMemo<MenuGroup[]>(() => [{
    id: 'session',
    items: [
      { id: 'duplicate', label: 'Duplicate', icon: 'copy', disabled: busy, onSelect: () => onDuplicate(id) },
      { id: 'delete', label: 'Delete', icon: 'trash-2', disabled: busy, onSelect: () => onDelete(id) },
    ],
  }], [busy, id, onDelete, onDuplicate]);
  const actions = (
    <ButtonRow gap="xs">
      <Tag>{playersLabel}</Tag>
      <Button size="sm" variant="ghost" aria-label={`Edit session ${name}`} onClick={edit}>Edit</Button>
      <Button size="sm" variant="primary" disabled={busy} aria-label={`Run ${name}`} onClick={run}>Run</Button>
      <DropdownMenu trigger={{ label: `More actions for ${name}`, icon: 'ellipsis', iconOnly: true }} variant="ghost" size="sm" groups={more} />
    </ButtonRow>
  );
  return <ListItemRow actionVisibility="always" name={name} meta={meta} action={actions} onDoubleClick={edit} />;
};

export { SessionRow };
