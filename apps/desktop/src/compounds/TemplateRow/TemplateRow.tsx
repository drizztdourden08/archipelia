/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { Badge, Button, ButtonRow } from '@drizztdourden08/tessera/primitives';
import type { TemplateRowProps } from './TemplateRow.type';

const TemplateRow = ({ id, name, meta, playersLabel, busy, onEdit, onRun, onDuplicate, onDelete }: TemplateRowProps) => {
  const edit = useCallback(() => onEdit(id), [id, onEdit]);
  const run = useCallback(() => onRun(id), [id, onRun]);
  const duplicate = useCallback(() => onDuplicate(id), [id, onDuplicate]);
  const remove = useCallback(() => onDelete(id), [id, onDelete]);
  const actions = (
    <ButtonRow gap="xs">
      <Badge variant="neutral">{playersLabel}</Badge>
      <Button size="sm" variant="ghost" onClick={edit}>Edit</Button>
      <Button size="sm" variant="ghost" disabled={busy} onClick={duplicate}>Duplicate</Button>
      <Button size="sm" variant="ghost" disabled={busy} onClick={remove}>Delete</Button>
      <Button size="sm" variant="primary" disabled={busy} onClick={run}>Run</Button>
    </ButtonRow>
  );
  return <ListItemRow name={name} meta={meta} action={actions} onDoubleClick={edit} />;
};

export { TemplateRow };
