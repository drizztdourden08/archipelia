/* @layer renderer-app @kind component */
import { Box, Button, ButtonRow, Field, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import type { GgSettingsProps } from './GgSettings.type';
import { useGgOwner } from './behavior/useGgOwner';

const GgSettings = ({ settings, onChange }: GgSettingsProps) => {
  const { hasOwner, busy, error, openRooms, resetOwner } = useGgOwner(settings.ggBaseUrl);
  return (
    <Stack>
      <Text variant="body">
        The site has no accounts. Rooms belong to a private owner id that Archipelia keeps in the vault, so only this
        app can send commands to them or read their logs.
      </Text>
      <Box data-search-anchor="site">
        <Field label="Site" hint="Change only for a self-hosted copy of the Archipelago website.">
          <TextInput value={settings.ggBaseUrl} onChange={(event) => onChange({ ggBaseUrl: event.target.value })} />
        </Field>
      </Box>
      <Text variant="body">{hasOwner ? 'An owner id is stored in the vault.' : 'No owner id yet. One is made the first time a session runs there.'}</Text>
      {error && <Text variant="body" role="alert">{error}</Text>}
      <Box data-search-anchor="owner">
        <ButtonRow align="start">
          <Button variant="secondary" disabled={!hasOwner || busy} onClick={openRooms}>Open my rooms in the browser</Button>
          <Button variant="secondary" disabled={!hasOwner || busy} onClick={resetOwner}>Forget the owner id</Button>
        </ButtonRow>
      </Box>
    </Stack>
  );
};

export { GgSettings };
