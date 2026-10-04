/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, ButtonRow, Status } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { RUN_STATUS } from '@archipelia/design';
import type { RecentSessionRowProps } from './RecentSessionRow.type';
import { sessionMeta } from '../../behavior/session-meta';

const RecentSessionRow = ({ session, now, onOpen }: RecentSessionRowProps) => {
  const openRow = useCallback(() => onOpen(session.id), [session.id, onOpen]);
  const status = RUN_STATUS[session.status];
  const action = (
    <ButtonRow gap="xs">
      <Status tone={status.tone}>{status.label}</Status>
      <Button size="sm" variant="ghost" aria-label={`Open run ${session.snapshot.name}`} onClick={openRow}>Open</Button>
    </ButtonRow>
  );
  return <ListItemRow actionVisibility="always" name={session.snapshot.name} meta={sessionMeta(session, now)} action={action} onDoubleClick={openRow} />;
};

export { RecentSessionRow };
