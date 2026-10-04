/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { Flex, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { RunProgress, useRunLauncher } from '../RunProgress';
import { SessionBuilder } from '../SessionBuilder';
import { useSessionsLibrary } from './behavior/useSessionsLibrary';
import { HistoryCard } from './sub-components/HistoryCard';
import { LibraryHeader } from './sub-components/LibraryHeader';
import { TemplatesCard } from './sub-components/TemplatesCard';
import './SessionsLibrary.css';

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

  const progress = <RunProgress launch={launcher.launch} onClose={launcher.dismiss} />;

  if (hub.editing) {
    return (
      <>
        <SessionBuilder initial={hub.editing} onBack={hub.closeBuilder} onRun={start} />
        {progress}
      </>
    );
  }

  return (
    <Stack>
      <LibraryHeader query={hub.query} onQuery={hub.setQuery} onNew={hub.createNew} />
      {hub.error && <Text variant="body" role="alert">{hub.error}</Text>}
      <Flex gap="md" align="start" wrap className="sessions-library__columns">
        <TemplatesCard
          templates={hub.visibleTemplates}
          total={hub.templates.length}
          servers={hub.servers}
          isBusy={hub.isBusy}
          onEdit={hub.edit}
          onRun={runTemplate}
          onDuplicate={hub.duplicate}
          onDelete={hub.deleteTemplate}
        />
        <HistoryCard
          runs={hub.visibleRuns}
          total={hub.runs.length}
          isBusy={hub.isBusy}
          onOpen={open}
          onShowLog={showLog}
          onDelete={hub.deleteRun}
        />
      </Flex>
      {progress}
    </Stack>
  );
};

export { SessionsLibrary };
