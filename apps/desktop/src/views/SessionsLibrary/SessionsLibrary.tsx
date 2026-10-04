/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Grid, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { useRunLauncher } from '../../hooks/useRunLauncher';
import { isWorking } from '../../runs/is-working';
import { showRunJob } from '../../runs/show-run-job';
import { useSessionsLibrary } from './behavior/useSessionsLibrary';
import { RunsCard } from './sub-components/RunsCard';
import { SessionsCard } from './sub-components/SessionsCard';
import { TemplateSearchEntry } from './sub-components/TemplateSearchEntry';

const SessionsLibrary = () => {
  const hub = useSessionsLibrary();
  const { byId, runs, openRun } = hub;
  const { start } = useRunLauncher();

  const runTemplate = useCallback((id: string) => {
    const template = byId(id);
    if (template) void start(template);
  }, [byId, start]);

  const showLog = useCallback((id: string) => {
    const run = runs.find((entry) => entry.id === id);
    if (run) void showRunJob(run);
  }, [runs]);

  const open = useCallback((id: string) => {
    const run = runs.find((entry) => entry.id === id);
    if (run && isWorking(run)) void showRunJob(run);
    else openRun(id);
  }, [openRun, runs]);

  return (
    <Stack>
      <Text variant="caption">A session is a saved setup you can run again. Each run makes a seed and a room, kept in Runs with its files.</Text>
      {hub.loadError && <ErrorCallout message={hub.loadError} onRetry={hub.reload} />}
      {hub.actionError && <ErrorCallout message={hub.actionError} />}
      {hub.templates.map((template) => <TemplateSearchEntry key={template.id} template={template} servers={hub.servers} />)}
      {!hub.loadError && (
        <Grid minColWidth={384} gap="md">
          <SessionsCard
            templates={hub.visibleTemplates}
            total={hub.templates.length}
            loading={hub.loading}
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
            loading={hub.loading}
            isBusy={hub.isBusy}
            onOpen={open}
            onShowLog={showLog}
            onDelete={hub.deleteRun}
          />
        </Grid>
      )}
    </Stack>
  );
};

export { SessionsLibrary };
