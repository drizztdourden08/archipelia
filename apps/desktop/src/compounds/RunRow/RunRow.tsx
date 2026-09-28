/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { Badge, Button, ButtonRow, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { RunRowProps } from './RunRow.type';
import './RunRow.css';

const RunRow = ({ id, when, name, host, status, error, hasLog, canDelete, busy, onOpen, onShowLog, onDelete }: RunRowProps) => {
  const open = useCallback(() => onOpen(id), [id, onOpen]);
  const showLog = useCallback(() => onShowLog(id), [id, onShowLog]);
  const remove = useCallback(() => onDelete(id), [id, onDelete]);
  const meta = (
    <Stack gap="xs">
      <Text variant="caption" className="run-row__when">{when} · {host}</Text>
      {error && <Text variant="caption" className="run-row__error">{error}</Text>}
    </Stack>
  );
  const actions = (
    <ButtonRow gap="xs">
      <Badge variant={status.variant}>{status.label}</Badge>
      {hasLog && <Button size="sm" variant="ghost" onClick={showLog}>Show log</Button>}
      <Button size="sm" variant="ghost" disabled={busy === true || !canDelete} onClick={remove}>Delete</Button>
      <Button size="sm" variant="secondary" onClick={open}>Open</Button>
    </ButtonRow>
  );
  return <ListItemRow className="run-row" role="listitem" name={name} meta={meta} action={actions} onDoubleClick={open} />;
};

export { RunRow };
