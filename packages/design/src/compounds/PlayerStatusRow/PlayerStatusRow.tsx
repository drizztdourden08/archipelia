/* @layer renderer-app @kind component */
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { ProgressBar, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import type { PlayerStatusRowProps } from './PlayerStatusRow.type';
import './PlayerStatusRow.css';

const PlayerStatusRow = ({ slot, name, game, status, statusTone, checks, progress }: PlayerStatusRowProps) => {
  const meta = (
    <Stack gap="xs">
      <Text variant="caption">{game}</Text>
      {progress && <ProgressBar value={progress.value} max={progress.max} />}
    </Stack>
  );
  const action = (
    <Stack gap="xs" align="end">
      <Status tone={statusTone}>{status}</Status>
      <Text variant="caption" className="player-status-row__checks">{checks}</Text>
    </Stack>
  );
  return <ListItemRow className="player-status-row" role="listitem" icon={String(slot)} name={name} meta={meta} action={action} />;
};

export { PlayerStatusRow };
