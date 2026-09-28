/* @layer renderer-app @kind component */
import { Button, ButtonRow, Card, EmptyState, Flex, Grid, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useHome } from './behavior/useHome';
import { engineHeadline } from './behavior/engine-headline';
import { engineMeta } from './behavior/engine-meta';
import { engineValue } from './behavior/engine-value';
import { gamesMeta } from './behavior/games-meta';
import { presetsMeta } from './behavior/presets-meta';
import { sessionMeta } from './behavior/session-meta';
import { summaryLine } from './behavior/summary-line';
import { CARD_MIN_COL } from './HomeView.constants';
import { StatCard } from '../../compounds/StatCard';
import { RecentSessionRow } from './sub-components/RecentSessionRow';
import './HomeView.css';

const HomeView = () => {
  const home = useHome();
  const { last, status, counts } = home;
  return (
    <Stack gap="lg" className="home-view">
      <Flex justify="between" align="center" wrap gap="md">
        <Stack gap="xs">
          <Text as="h1" variant="title">{engineHeadline(status)}</Text>
          <Text variant="caption">{summaryLine(status, counts)}</Text>
        </Stack>
        <ButtonRow>
          <Button variant="secondary" onClick={home.newSession}>New session</Button>
          {last && (
            <Button variant="primary" disabled={home.busy} onClick={home.runAgain}>{`Run "${last.snapshot.name}" again`}</Button>
          )}
        </ButtonRow>
      </Flex>
      {home.error && <Text variant="body" role="alert">{home.error}</Text>}
      <Grid minColWidth={CARD_MIN_COL} gap="md">
        <StatCard
          heading="last session"
          value={last?.snapshot.name ?? 'None yet'}
          meta={last ? sessionMeta(last, home.now) : 'Build one in Sessions'}
          action={home.lastAction}
        />
        <StatCard heading="games" value={String(counts.games)} meta={gamesMeta(home.installed)} />
        <StatCard heading="presets" value={String(counts.presets)} meta={presetsMeta(home.presets)} />
        <StatCard heading="templates" value={String(counts.templates)} meta="saved sessions" />
        <StatCard heading="engine" value={engineValue(status)} meta={engineMeta(status)} action={home.engineAction} />
      </Grid>
      <Card>
        <Stack gap="sm">
          <Text variant="label">Recent sessions</Text>
          {home.recent.length === 0
            ? <EmptyState message="No session has run yet." />
            : home.recent.map((session) => <RecentSessionRow key={session.id} session={session} now={home.now} onOpen={home.openSession} />)}
        </Stack>
      </Card>
    </Stack>
  );
};

export { HomeView };
