/* @layer renderer-app @kind component */
import { widgets } from '@drizztdourden08/brock-react';
import { ActionTile, StatTile } from '@drizztdourden08/tessera/composites';
import { Grid } from '@drizztdourden08/tessera/primitives';
import type { PlayerView } from '@archipelia/sessions/live-room';
import { connectedCount, hintCounts } from '@archipelia/sessions/live-room';
import type { SessionSummaryProps } from './SessionSummary.type';
import { SUMMARY_MIN_COL, SUMMARY_WIDGET } from './SessionSummary.constants';

const checksSeen = (players: readonly PlayerView[]) => players.reduce((sum, player) => sum + (player.checked ?? 0), 0);

const showPlayers = () => widgets.open(SUMMARY_WIDGET.players);

const showHints = () => widgets.open(SUMMARY_WIDGET.hints);

const SessionSummary = ({ players, hints, phase, uptime, status }: SessionSummaryProps) => {
  const counts = hintCounts(hints);
  const live = phase === 'live';
  return (
    <Grid minColWidth={SUMMARY_MIN_COL} gap="md">
      <ActionTile
        label="Players"
        icon="users"
        value={live ? `${connectedCount(players)} / ${players.length}` : players.length}
        unit={live ? 'connected' : 'in the session'}
        onOpen={showPlayers}
        openLabel="Show the Players widget"
      />
      <StatTile label="Checks" value={checksSeen(players)} unit="seen by the server" />
      <ActionTile
        label="Hints"
        icon="compass"
        value={live ? counts.open : '-'}
        unit={live ? `open, ${counts.found} found` : 'shown while watching'}
        onOpen={showHints}
        openLabel="Show the Hints widget"
      />
      <StatTile label="Uptime" value={uptime ?? '-'} unit={status.toLowerCase()} />
    </Grid>
  );
};

export { SessionSummary };
