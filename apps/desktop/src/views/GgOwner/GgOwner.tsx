/* @layer renderer-app @kind component */
import { Box, Button, ButtonRow, Callout, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { GgOwnerProps } from './GgOwner.type';
import { useGgOwner } from './behavior/useGgOwner';

const GgOwner = ({ baseUrl }: GgOwnerProps) => {
  const { hasOwner, busy, error, openRooms, resetOwner } = useGgOwner(baseUrl);
  return (
    <Stack>
      <Text variant="body">
        The site has no accounts. Rooms belong to a private owner id that Archipelia keeps in the vault, so only this
        app can send commands to them or read their logs.
      </Text>
      <Text variant="body">{hasOwner ? 'An owner id is stored in the vault.' : 'No owner id yet. One is made the first time a session runs there.'}</Text>
      {error && <Box role="alert"><Callout tone="danger">{error}</Callout></Box>}
      <ButtonRow align="start">
        <Button variant="secondary" disabled={!hasOwner || busy} onClick={openRooms}>Open my rooms in the browser</Button>
        <Button variant="danger" disabled={!hasOwner || busy} onClick={resetOwner}>Forget the owner id</Button>
      </ButtonRow>
    </Stack>
  );
};

export { GgOwner };
