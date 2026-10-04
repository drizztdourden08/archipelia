/* @layer renderer-app @kind component */
import { useCallback, useEffect, useMemo } from 'react';
import { confirmAction } from '@drizztdourden08/brock-react';
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { logCopyText } from '@archipelia/design';
import { Box, Button, ButtonRow, Callout, Stack, StatRow, Status, Text } from '@drizztdourden08/tessera/primitives';
import { useEngineStore } from '../../stores/useEngineStore';
import { engineLogRows } from './behavior/engine-log-rows';
import { engineView } from './behavior/engine-view';
import { REBUILD_CONFIRM } from './EngineSettings.constants';

const EngineSettings = () => {
  const { status, lines, refresh, setup } = useEngineStore();
  useEffect(() => { void refresh(); }, [refresh]);
  const rows = useMemo(() => engineLogRows(lines), [lines]);
  const { state, building, ready, apVersion, dir, error } = engineView(status);
  const rebuild = useCallback(() => {
    void confirmAction(REBUILD_CONFIRM).then((confirmed) => { if (confirmed) void setup(); });
  }, [setup]);

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
      <ButtonRow align="start">
        {!ready && <Button variant="primary" disabled={building} onClick={() => { void setup(); }}>Set up engine</Button>}
        <Button variant={ready ? 'primary' : 'secondary'} disabled={building} onClick={() => { void refresh(); }}>Check again</Button>
        {ready && <Button variant="danger" onClick={rebuild}>Rebuild engine</Button>}
      </ButtonRow>
      {rows.length > 0 && <LogPanel rows={rows} copyText={logCopyText} countLabel="lines" emptyLabel="No output yet" />}
    </Stack>
  );
};

export { EngineSettings };
