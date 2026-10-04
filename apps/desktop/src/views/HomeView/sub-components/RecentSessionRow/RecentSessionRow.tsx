/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Button, ButtonRow } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import type { RecentSessionRowProps } from './RecentSessionRow.type';
import { sessionMeta } from '../../behavior/session-meta';

const RecentSessionRow = ({ session, now, onOpen }: RecentSessionRowProps) => {
  const openRow = useCallback(() => onOpen(session.id), [session.id, onOpen]);
  const action = (
    <ButtonRow gap="xs">
      <Button size="sm" variant="ghost" onClick={openRow}>Open</Button>
    </ButtonRow>
  );
  return <ListItemRow actionVisibility="always" name={session.snapshot.name} meta={sessionMeta(session, now)} action={action} onDoubleClick={openRow} />;
};

export { RecentSessionRow };
