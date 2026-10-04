/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { Box, Button, Callout, EmptyState, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useHome } from './behavior/useHome';
import { engineLine } from './behavior/engine-line';
import { homeFacts } from './behavior/home-facts';
import { HERO_TITLE } from './HomeView.constants';
import type { HomeViewProps } from './HomeView.type';
import { RecentSessionRow } from './sub-components/RecentSessionRow';

const HomeView = ({ slots }: HomeViewProps) => {
  const { Eyebrow, Title, Actions, Facts, Aside } = slots;
  const home = useHome();
  const { last, now, status, counts, installed, presets } = home;
  const facts = useMemo(() => homeFacts({ last, now, status, counts, installed, presets }), [last, now, status, counts, installed, presets]);
  return (
    <>
      <Eyebrow>{engineLine(status)}</Eyebrow>
      <Title>{HERO_TITLE}</Title>
      <Actions>
        {home.engineNeeded && <Button variant="primary" onClick={home.openEngine}>Open Engine</Button>}
        <Button variant="secondary" onClick={home.newSession}>New session</Button>
        {last && (
          <Button variant="primary" disabled={home.busy} onClick={home.runAgain}>{`Run "${last.snapshot.name}" again`}</Button>
        )}
      </Actions>
      <Facts rows={facts} />
      <Aside>
        <Stack gap="sm">
          <Text variant="label">Recent runs</Text>
          {home.error && <Box role="alert"><Callout tone="danger">{home.error}</Callout></Box>}
          {home.recent.length === 0
            ? <EmptyState message="Nothing has run yet." />
            : home.recent.map((session) => <RecentSessionRow key={session.id} session={session} now={now} onOpen={home.openSession} />)}
        </Stack>
      </Aside>
    </>
  );
};

export { HomeView };
