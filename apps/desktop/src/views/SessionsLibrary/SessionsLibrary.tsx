/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Box, Callout, Grid, Stack } from '@drizztdourden08/tessera/primitives';
import { RunProgress, useRunLauncher } from '../RunProgress';
import { useSessionsLibrary } from './behavior/useSessionsLibrary';
import { RunsCard } from './sub-components/RunsCard';
import { LibraryHeader } from './sub-components/LibraryHeader';
import { SessionsCard } from './sub-components/SessionsCard';

const SessionsLibrary = () => {
  const hub = useSessionsLibrary();
  const launcher = useRunLauncher();
  const { byId, runs, openRun } = hub;
  const { start, inspect } = launcher;

  const runTemplate = useCallback((id: string) => {
    const template = byId(id);
    if (template) void start(template);
  }, [byId, start]);

  const showLog = useCallback((id: string) => {
    const run = runs.find((entry) => entry.id === id);
    if (run) inspect(run);
  }, [inspect, runs]);

  const open = useCallback((id: string) => {
    const run = runs.find((entry) => entry.id === id);
    if (run && (run.status === 'generating' || run.status === 'starting')) inspect(run);
    else openRun(id);
  }, [inspect, openRun, runs]);

  return (
    <Stack>
      <LibraryHeader query={hub.query} onQuery={hub.setQuery} onNew={hub.createNew} />
      {hub.error && <Box role="alert"><Callout tone="danger">{hub.error}</Callout></Box>}
      <Grid minColWidth={384} gap="md">
        <SessionsCard
          templates={hub.visibleTemplates}
          total={hub.templates.length}
          servers={hub.servers}
          isBusy={hub.isBusy}
          onEdit={hub.edit}
          onRun={runTemplate}
          onDuplicate={hub.duplicate}
          onDelete={hub.deleteTemplate}
        />
        <RunsCard
          runs={hub.visibleRuns}
          total={hub.runs.length}
          isBusy={hub.isBusy}
          onOpen={open}
          onShowLog={showLog}
          onDelete={hub.deleteRun}
        />
      </Grid>
      <RunProgress launch={launcher.launch} onClose={launcher.dismiss} />
    </Stack>
  );
};

export { SessionsLibrary };
