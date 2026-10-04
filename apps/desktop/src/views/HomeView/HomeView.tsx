/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { Box, Button, Callout, EmptyState, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useHome } from './behavior/useHome';
import { engineLine } from './behavior/engine-line';
import { heroActions } from './behavior/hero-actions';
import { heroTitle } from './behavior/hero-title';
import { homeFacts } from './behavior/home-facts';
import type { HomeViewProps } from './HomeView.type';
import { RecentSessionRow } from './sub-components/RecentSessionRow';
import { SetupChecklist } from './sub-components/SetupChecklist';

const HomeView = ({ slots }: HomeViewProps) => {
  const { Eyebrow, Title, Actions, Facts, Aside } = slots;
  const home = useHome();
  const { last, now, status, counts, installed, presets, next, engineNeeded, busy } = home;
  const facts = useMemo(() => homeFacts({ last, now, status, counts, installed, presets }), [last, now, status, counts, installed, presets]);
  const actions = useMemo(() => heroActions({ engineNeeded, next, last, busy }), [engineNeeded, next, last, busy]);
  return (
    <>
      <Eyebrow>{engineLine(status)}</Eyebrow>
      <Title>{heroTitle(status, next, home.recent.length > 0)}</Title>
      <Actions>
        {actions.map((action) => (
          <Button key={action.id} variant={action.primary ? 'primary' : 'secondary'} disabled={action.disabled} onClick={() => home.act(action.id)}>
            {action.label}
          </Button>
        ))}
      </Actions>
      <Facts rows={facts} />
      <Aside>
        {home.firstRun ? <SetupChecklist steps={home.steps} onStep={home.act} /> : (
          <Stack gap="sm">
            <Text variant="label">Recent runs</Text>
            {home.error && <Box role="alert"><Callout tone="danger">{home.error}</Callout></Box>}
            {home.recent.length === 0
              ? <EmptyState message="Nothing has run yet." />
              : home.recent.map((session) => <RecentSessionRow key={session.id} session={session} now={now} onOpen={home.openSession} />)}
          </Stack>
        )}
      </Aside>
    </>
  );
};

export { HomeView };
