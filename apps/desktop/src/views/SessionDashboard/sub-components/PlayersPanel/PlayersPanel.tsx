/* @layer renderer-app @kind component */
import { EmptyState, Stack } from '@drizztdourden08/tessera/primitives';
import { checksLabel } from '@archipelia/sessions/live-room';
import { STATUS_TONE } from './PlayersPanel.constants';
import type { PlayersPanelProps } from './PlayersPanel.type';
import { LiveStatus } from '../LiveStatus';
import { progressOf } from '../../behavior/progress-of';
import { PlayerStatusRow } from '@archipelia/design';

const PlayersPanel = ({ rows, connection }: PlayersPanelProps) => (
  <Stack gap="sm" className="session-panel">
    <LiveStatus connection={connection} />
    {rows.length === 0 && <EmptyState message="No players in this session." />}
    {rows.length > 0 && (
      <Stack gap="sm" role="list" aria-label="Players">
        {rows.map((row) => (
          <PlayerStatusRow
            key={row.slot}
            slot={row.slot}
            name={row.name}
            game={row.game}
            status={row.status}
            statusTone={STATUS_TONE[row.status]}
            checks={checksLabel(row)}
            progress={progressOf(row)}
          />
        ))}
      </Stack>
    )}
  </Stack>
);

export { PlayersPanel };
