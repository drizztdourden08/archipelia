/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
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
      <Status tone={status.tone}>{status.label}</Status>
      {hasLog && <Button size="sm" variant="ghost" aria-label={`Show log of run ${name}`} onClick={showLog}>Show log</Button>}
      <Button size="sm" variant="danger" disabled={busy === true || !canDelete} aria-label={`Delete run ${name}`} onClick={remove}>Delete</Button>
      <Button size="sm" variant="secondary" aria-label={`Open run ${name}`} onClick={open}>Open</Button>
    </ButtonRow>
  );
  return <ListItemRow actionVisibility="always" role="listitem" name={name} meta={meta} action={actions} onDoubleClick={open} />;
};

export { RunRow };
