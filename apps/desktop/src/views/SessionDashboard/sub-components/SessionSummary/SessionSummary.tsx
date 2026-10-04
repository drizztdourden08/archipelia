/* @layer renderer-app @kind component */
import { StatTile } from '@drizztdourden08/tessera/composites';
import { Grid } from '@drizztdourden08/tessera/primitives';
import type { PlayerView } from '../../../../live-room/live-room.type';
import type { SessionSummaryProps } from './SessionSummary.type';
import { hintCounts } from '../../../../live-room/hint-counts';
import { SUMMARY_MIN_COL } from './SessionSummary.constants';
import { connectedCount } from '../../../../live-room/connected-count';

const checksSeen = (players: readonly PlayerView[]) => players.reduce((sum, player) => sum + (player.checked ?? 0), 0);

const SessionSummary = ({ players, hints, phase, uptime, status }: SessionSummaryProps) => {
  const counts = hintCounts(hints);
  const live = phase === 'live';
  return (
    <Grid minColWidth={SUMMARY_MIN_COL} gap="md">
      <StatTile label="Players" value={live ? `${connectedCount(players)} / ${players.length}` : players.length} unit={live ? 'connected' : 'in the session'} />
      <StatTile label="Checks" value={checksSeen(players)} unit="seen by the server" />
      <StatTile label="Hints" value={live ? counts.open : '-'} unit={live ? `open, ${counts.found} found` : 'shown while watching'} />
      <StatTile label="Uptime" value={uptime ?? '-'} unit={status.toLowerCase()} />
    </Grid>
  );
};

export { SessionSummary };
