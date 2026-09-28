/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { HintsPanelProps } from './HintsPanel.type';
import { LiveNotice } from '../LiveNotice';
import { HintRow } from '../../../../compounds/HintRow';
import { HINT_VARIANT } from '../../../../widgets/live-room/hint-rows.constants';

const HintsPanel = ({ rows, phase, error, onPassword }: HintsPanelProps) => (
  <Stack gap="sm" className="session-panel">
    {phase !== 'live' && <LiveNotice phase={phase} error={error} onPassword={onPassword} />}
    {phase === 'live' && rows.length === 0 && <Text variant="caption">No hints yet.</Text>}
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
            stateVariant={HINT_VARIANT[row.state]}
          />
        ))}
      </Stack>
    )}
  </Stack>
);

export { HintsPanel };
