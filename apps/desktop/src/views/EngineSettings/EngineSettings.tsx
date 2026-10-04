/* @layer renderer-app @kind component */
import { useEffect, useMemo } from 'react';
import { SettingActions, useJob } from '@drizztdourden08/brock-react';
import { Button, Flex, Icon, ProgressBar, Stack, StatRow, Status, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { ENGINE_JOB } from '../../jobs/jobs.constants';
import { useEngineStore } from '../../stores/useEngineStore';
import { useLoggedFailure } from '../../hooks/useLoggedFailure';
import { engineActions } from './behavior/engine-actions';
import { engineView } from './behavior/engine-view';
import { openEngineFolder } from './behavior/open-engine-folder';
import { setupProgress } from './behavior/setup-progress';
import { FAILURE } from './EngineSettings.constants';

const EngineSettings = () => {
  const { status, refresh, setup } = useEngineStore();
  const { job, open } = useJob(ENGINE_JOB);
  useEffect(() => { void refresh(); }, [refresh]);
  const { state, building, ready, apVersion, dir, error } = engineView(status);
  const failure = useLoggedFailure(error, FAILURE.setup);
  const progress = setupProgress(job);
  const actions = useMemo(
    () => engineActions({ ready, building, setup, refresh, showProgress: job ? open : undefined }),
    [ready, building, setup, refresh, job, open],
  );

  return (
    <Stack>
      <Text variant="body">
        The engine is a private Python with the pinned Archipelago source. It generates seeds and runs the servers,
        out of sight. Setting it up downloads about 90 MB once.
      </Text>
      <Status tone={state.tone}>{state.label}</Status>
      {progress && <ProgressBar value={progress.percent} label="Engine setup" showValue live />}
      {progress && <Text variant="caption">{progress.step}</Text>}
      <StatRow label="Archipelago" value={apVersion} />
      <Flex gap="sm" align="center" wrap>
        <StatRow label="Folder" value={dir} />
        <Button size="sm" variant="secondary" icon={<Icon name="folder-open" />} disabled={!dir} onClick={openEngineFolder}>Open folder</Button>
      </Flex>
      {failure && <ErrorCallout message={failure} />}
      <SettingActions actions={actions} align="start" />
    </Stack>
  );
};

export { EngineSettings };
