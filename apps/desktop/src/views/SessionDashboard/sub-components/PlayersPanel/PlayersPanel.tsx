/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { PlayerView } from '../../../../widgets/live-room/live-room.type';
import type { PlayersPanelProps } from './PlayersPanel.type';
import { LiveNotice } from '../LiveNotice';
import { PlayerStatusRow } from '@archipelia/design';
import { STATUS_TONE } from '../../../../widgets/live-room/client-status.constants';
import { checksLabel } from '../../../../widgets/live-room/checks-label';

const progressOf = ({ checked, total }: PlayerView) => (checked !== null && total ? { value: checked, max: total } : null);

const PlayersPanel = ({ rows, phase, error, onPassword }: PlayersPanelProps) => (
  <Stack gap="sm" className="session-panel">
    <LiveNotice phase={phase} error={error} onPassword={onPassword} />
    {rows.length === 0 && <Text variant="caption">No players in this session.</Text>}
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
