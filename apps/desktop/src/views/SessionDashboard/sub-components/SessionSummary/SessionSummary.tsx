/* @layer renderer-app @kind component */
import { Grid } from '@drizztdourden08/tessera/primitives';
import type { PlayerView } from '../../../../widgets/live-room/live-room.type';
import type { SessionSummaryProps } from './SessionSummary.type';
import { hintCounts } from '../../../../widgets/live-room/hint-counts';
import { SUMMARY_MIN_COL } from './SessionSummary.constants';
import { StatCard } from '@archipelia/design';
import { connectedCount } from '../../../../widgets/live-room/connected-count';

const checksSeen = (players: readonly PlayerView[]) => players.reduce((sum, player) => sum + (player.checked ?? 0), 0);

const SessionSummary = ({ players, hints, phase, uptime, status }: SessionSummaryProps) => {
  const counts = hintCounts(hints);
  const live = phase === 'live';
  return (
    <Grid minColWidth={SUMMARY_MIN_COL} gap="md">
      <StatCard heading="players" value={live ? `${connectedCount(players)} / ${players.length}` : String(players.length)} meta={live ? 'connected' : 'in the session'} />
      <StatCard heading="checks" value={String(checksSeen(players))} meta="seen by the server" />
      <StatCard heading="hints" value={live ? String(counts.open) : '-'} meta={live ? `open, ${counts.found} found` : 'shown while watching'} />
      <StatCard heading="uptime" value={uptime ?? '-'} meta={status.toLowerCase()} />
    </Grid>
  );
};

export { SessionSummary };
