/* @layer renderer-app @kind component */
import { EmptyState, Stack } from '@drizztdourden08/tessera/primitives';
import type { HintsPanelProps } from './HintsPanel.type';
import { LiveNotice } from '../LiveNotice';
import { HintRow } from '@archipelia/design';
import { HINT_TONE } from '../../../../live-room/hint-rows.constants';

const HintsPanel = ({ rows, phase, error, onPassword }: HintsPanelProps) => (
  <Stack gap="sm" className="session-panel">
    {phase !== 'live' && <LiveNotice phase={phase} error={error} onPassword={onPassword} />}
    {phase === 'live' && rows.length === 0 && <EmptyState message="No hints yet." />}
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
