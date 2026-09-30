/* @layer renderer-app @kind component */
import { useEffect, useMemo } from 'react';
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Stack, StatRow, Status, Text } from '@drizztdourden08/tessera/primitives';
import { useEngineStore } from '../../state/useEngineStore';
import { engineLogRows } from './behavior/engine-log-rows';
import { engineView } from './behavior/engine-view';

const EngineSettings = () => {
  const { status, lines, refresh, setup } = useEngineStore();
  useEffect(() => { void refresh(); }, [refresh]);
  const rows = useMemo(() => engineLogRows(lines), [lines]);
  const { state, building, apVersion, dir, error, setupLabel } = engineView(status);

  return (
    <Stack>
      <Text as="h2" variant="subtitle">Engine</Text>
      <Text variant="body">
        The engine is a private Python with the pinned Archipelago source. It generates seeds and runs the servers,
        out of sight. Setting it up downloads about 90 MB once.
      </Text>
      <Status tone={state.tone}>{state.label}</Status>
      <StatRow label="Archipelago" value={apVersion} />
      <StatRow label="Folder" value={dir} />
      {error && <Text variant="body" role="alert">{error}</Text>}
      <ButtonRow align="start">
        <Button variant="primary" disabled={building} onClick={() => { void setup(); }}>{setupLabel}</Button>
        <Button variant="secondary" disabled={building} onClick={() => { void refresh(); }}>Check again</Button>
      </ButtonRow>
      {rows.length > 0 && <LogPanel rows={rows} countLabel={`${rows.length} lines`} emptyLabel="No output yet" />}
    </Stack>
  );
};

export { EngineSettings };
