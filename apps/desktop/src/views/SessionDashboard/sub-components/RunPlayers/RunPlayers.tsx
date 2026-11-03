/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { PlayerStatusRow } from '@archipelia/design';
import { playerMenuGroups } from '../../behavior/player-menu-groups';
import { runRowOf } from '../../behavior/run-row-of';
import { RUN_STAGE_TEXT } from '../../behavior/run-stage.constants';
import { useRoomCommand } from '../../behavior/useRoomCommand';
import { PlayerMenu } from '../PlayerMenu';
import type { RunPlayersProps } from './RunPlayers.type';

const RunPlayers = ({ session, rows }: RunPlayersProps) => {
  const confirm = useRoomCommand(session.id);
  const off = session.status !== 'hosting';
  if (rows.length === 0) return null;
  return (
    <Stack gap="sm" role="list" aria-label={RUN_STAGE_TEXT.players}>
      {rows.map((row) => (
        <PlayerStatusRow
          key={row.slot}
          {...runRowOf(row, session)}
          menu={<PlayerMenu name={row.name} groups={playerMenuGroups(row.name, confirm, off)} />}
        />
      ))}
    </Stack>
  );
};

export { RunPlayers };
