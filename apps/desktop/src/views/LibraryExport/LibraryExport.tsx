/* @layer renderer-app @kind component */
import { Button, ButtonRow, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useLibraryExport } from './behavior/useLibraryExport';

const LibraryExport = () => {
  const { busy, exportLibrary, message } = useLibraryExport();
  return (
    <Stack gap="sm">
      <Text variant="body">Saves every preset and saved session to one zip file.</Text>
      <ButtonRow align="start">
        <Button variant="primary" disabled={busy} onClick={exportLibrary} icon={<Icon name="upload" />}>Export presets and sessions</Button>
      </ButtonRow>
      {message && <Text variant="body" role="status">{message}</Text>}
    </Stack>
  );
};

export { LibraryExport };
