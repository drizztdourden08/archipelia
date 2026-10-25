/* @layer renderer-app @kind component */
import { PanelContainer } from '@drizztdourden08/tessera/composites';
import { EmptyState, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { TEXT } from '../../JoinSession.constants';
import type { JoinedListProps } from '../../JoinSession.type';
import { JoinCard } from '../JoinCard';

const JoinedList = ({ joined }: JoinedListProps) => (
  <PanelContainer title={TEXT.joined}>
    <Stack gap="sm">
      {joined.error && <ErrorCallout message={joined.error} />}
      {joined.joins.length === 0 && <EmptyState message={TEXT.noJoins} />}
      {joined.joins.map((join) => (
        <JoinCard key={join.id} join={join} busy={joined.busy} onLeave={joined.leave} onResume={joined.resume} onDismiss={joined.dismiss} />
      ))}
    </Stack>
  </PanelContainer>
);

export { JoinedList };
