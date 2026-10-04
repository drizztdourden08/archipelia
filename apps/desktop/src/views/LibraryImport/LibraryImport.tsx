/* @layer renderer-app @kind component */
import { Button, ButtonRow, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useLibraryImport } from './behavior/useLibraryImport';

const LibraryImport = () => {
  const { busy, importLibrary, message } = useLibraryImport();
  return (
    <Stack gap="sm">
      <Text variant="body">Adds the presets and templates from an exported zip file.</Text>
      <ButtonRow align="start">
        <Button variant="primary" disabled={busy} onClick={importLibrary} icon={<Icon name="download" />}>Import a zip file</Button>
      </ButtonRow>
      {message && <Text variant="body" role="status">{message}</Text>}
    </Stack>
  );
};

export { LibraryImport };
