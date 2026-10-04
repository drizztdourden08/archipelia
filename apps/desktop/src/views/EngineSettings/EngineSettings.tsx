/* @layer renderer-app @kind component */
import { useEffect, useMemo } from 'react';
import { SettingActions } from '@drizztdourden08/brock-react';
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { logCopyText } from '@archipelia/design';
import { Box, Callout, Stack, StatRow, Status, Text } from '@drizztdourden08/tessera/primitives';
import { useEngineStore } from '../../stores/useEngineStore';
import { engineActions } from './behavior/engine-actions';
import { engineLogRows } from './behavior/engine-log-rows';
import { engineView } from './behavior/engine-view';

const EngineSettings = () => {
  const { status, lines, refresh, setup } = useEngineStore();
  useEffect(() => { void refresh(); }, [refresh]);
  const rows = useMemo(() => engineLogRows(lines), [lines]);
  const { state, building, ready, apVersion, dir, error } = engineView(status);
  const actions = useMemo(() => engineActions({ ready, building, setup, refresh }), [ready, building, setup, refresh]);

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
      {rows.length > 0 && <LogPanel rows={rows} copyText={logCopyText} countLabel="lines" emptyLabel="No output yet" />}
    </Stack>
  );
};

export { EngineSettings };
