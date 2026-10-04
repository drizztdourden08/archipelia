/* @layer renderer-app @kind component */
import { Button, ButtonRow, Card, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { CLEAN_DAYS } from './DataView.constants';
import type { DataViewProps } from './DataView.type';
import { useDataView } from './behavior/useDataView';
import { DataOverview } from './sub-components/DataOverview';

const DataView = ({ part }: DataViewProps) => {
  const { busy, clean, exportLibrary, importLibrary, message, retrySummary, reveal, runs, stale, summary, summaryError } = useDataView();
  return (
    <Stack>
      {part === 'overview' && <DataOverview summary={summary} error={summaryError} onRetry={retrySummary} onReveal={reveal} />}
      {part === 'runs' && (
        <Card>
          <Stack gap="xs">
            <Text variant="body">{runs.length} runs kept, {stale.length} older than {CLEAN_DAYS} days.</Text>
            <ButtonRow align="start">
              <Button variant="danger" disabled={busy || stale.length === 0} onClick={clean}><Icon name="trash-2" />Remove runs older than {CLEAN_DAYS} days</Button>
            </ButtonRow>
          </Stack>
        </Card>
      )}
      {part === 'export' && (
        <Stack gap="sm">
          <Text variant="body">Saves every preset and session template to one zip file.</Text>
          <ButtonRow align="start">
            <Button variant="primary" disabled={busy} onClick={exportLibrary}><Icon name="upload" />Export presets and templates</Button>
          </ButtonRow>
        </Stack>
      )}
      {part === 'import' && (
        <Stack gap="sm">
          <Text variant="body">Adds the presets and templates from an exported zip file.</Text>
          <ButtonRow align="start">
            <Button variant="primary" disabled={busy} onClick={importLibrary}><Icon name="download" />Import a zip file</Button>
          </ButtonRow>
        </Stack>
      )}
      {message && <Text variant="body" role="status">{message}</Text>}
    </Stack>
  );
};

export { DataView };
