/* @layer renderer-app @kind component */
import { formatBytes } from '@drizztdourden08/brock-core/format';
import { Button, ButtonRow, Card, Grid, Stack, StatRow, Text } from '@drizztdourden08/tessera/primitives';
import { CLEAN_DAYS } from './DataView.constants';
import { useDataView } from './behavior/useDataView';

const DataView = () => {
  const { busy, clean, exportLibrary, importLibrary, message, reveal, runs, stale, summary } = useDataView();
  return (
    <Stack>
      <Stack gap="xs">
        <Text as="h1" variant="title">Data</Text>
        <Text variant="caption">{summary ? `${summary.location.path} · ${formatBytes(summary.totalBytes)}` : 'Reading the data folder'}</Text>
      </Stack>
      <ButtonRow align="start">
        <Button variant="secondary" disabled={!summary?.location.canReveal} onClick={reveal}>Open folder</Button>
        <Button variant="secondary" disabled={busy} onClick={exportLibrary}>Export presets and templates</Button>
        <Button variant="secondary" disabled={busy} onClick={importLibrary}>Import</Button>
      </ButtonRow>
      {message && <Text variant="body" role="status">{message}</Text>}
      <Grid minColWidth={240} gap="md">
        {(summary?.domains ?? []).map((domain) => (
          <Card key={domain.domain}>
            <Stack gap="xs">
              <Text variant="subtitle">{domain.label}</Text>
              <StatRow label="Files" value={String(domain.count)} />
              <StatRow label="Size" value={formatBytes(domain.bytes)} />
            </Stack>
          </Card>
        ))}
      </Grid>
      <Card>
        <Stack gap="xs">
          <Text variant="subtitle">Session runs</Text>
          <Text variant="body">{runs.length} runs kept, {stale.length} older than {CLEAN_DAYS} days.</Text>
          <ButtonRow align="start">
            <Button variant="secondary" disabled={busy || stale.length === 0} onClick={clean}>Remove runs older than {CLEAN_DAYS} days</Button>
          </ButtonRow>
        </Stack>
      </Card>
    </Stack>
  );
};

export { DataView };
