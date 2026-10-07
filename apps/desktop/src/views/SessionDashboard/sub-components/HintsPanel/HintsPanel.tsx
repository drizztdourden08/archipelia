/* @layer renderer-app @kind component */
import { EmptyState, Stack } from '@drizztdourden08/tessera/primitives';
import type { HintsPanelProps } from './HintsPanel.type';
import { LiveStatus } from '../LiveStatus';
import { HintRow } from '@archipelia/design';
import { HINT_TONE } from './HintsPanel.constants';

const HintsPanel = ({ rows, connection }: HintsPanelProps) => (
  <Stack gap="sm" className="session-panel">
    {connection.phase !== 'live' && <LiveStatus connection={connection} />}
    {connection.phase === 'live' && rows.length === 0 && <EmptyState message="No hints yet." />}
    {rows.length > 0 && (
      <Stack gap="sm" role="list" aria-label="Hints">
        {rows.map((row) => (
          <HintRow
            key={row.key}
            item={row.item}
            receiver={row.receiver}
            finder={row.finder}
            location={row.location}
            entrance={row.entrance}
            state={row.state}
            stateTone={HINT_TONE[row.state]}
          />
        ))}
      </Stack>
    )}
  </Stack>
);

export { HintsPanel };
