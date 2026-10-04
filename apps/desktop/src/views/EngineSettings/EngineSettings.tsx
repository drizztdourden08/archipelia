/* @layer renderer-app @kind component */
import { useEffect, useMemo } from 'react';
import { SettingActions, useJob } from '@drizztdourden08/brock-react';
import { Box, Callout, Stack, StatRow, Status, Text } from '@drizztdourden08/tessera/primitives';
import { ENGINE_JOB } from '../../jobs/jobs.constants';
import { useEngineStore } from '../../stores/useEngineStore';
import { engineActions } from './behavior/engine-actions';
import { engineView } from './behavior/engine-view';

const EngineSettings = () => {
  const { status, refresh, setup } = useEngineStore();
  const { job, open } = useJob(ENGINE_JOB);
  useEffect(() => { void refresh(); }, [refresh]);
  const { state, building, ready, apVersion, dir, error } = engineView(status);
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
      <StatRow label="Archipelago" value={apVersion} />
      <StatRow label="Folder" value={dir} />
      {error && <Box role="alert"><Callout tone="danger">{error}</Callout></Box>}
      <SettingActions actions={actions} align="start" />
    </Stack>
  );
};

export { EngineSettings };
