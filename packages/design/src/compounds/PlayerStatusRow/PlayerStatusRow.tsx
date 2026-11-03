/* @layer renderer-app @kind component */
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { Inline, ProgressBar, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { initialsOf } from '../LobbySeat/behavior/initials-of';
import type { PlayerStatusRowProps } from './PlayerStatusRow.type';
import './PlayerStatusRow.css';

const PlayerStatusRow = ({ slot, name, game, kind, status, statusTone, checks, progress, goal, menu }: PlayerStatusRowProps) => {
  const meta = (
    <Stack gap="xs">
      <Text variant="caption">{kind ? `${game} · ${kind}` : game}</Text>
      {progress && <ProgressBar value={progress.value} max={progress.max} />}
    </Stack>
  );
  const action = (
    <Inline gap="sm" align="center">
      <Stack gap="xs" align="end">
        <Status tone={statusTone}>{status}</Status>
        <Text variant="caption" className="player-status-row__checks">{checks}</Text>
      </Stack>
      {goal && <Text variant="caption" tone={goal.done ? 'success' : 'dim'} className="player-status-row__goal">{goal.label}</Text>}
      {menu}
    </Inline>
  );
  return (
    <ListItemRow
      actionVisibility="always"
      className="player-status-row"
      role="listitem"
      icon={initialsOf(game)}
      data={{ 'data-slot': String(slot) }}
      name={name}
      meta={meta}
      action={action}
    />
  );
};

export { PlayerStatusRow };
