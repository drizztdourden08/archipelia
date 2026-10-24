/* @layer renderer-app @kind component */
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { useLobbyCreate } from './behavior/useLobbyCreate';

const LobbyCreate = () => {
  const model = useLobbyCreate();
  return (
    <Stack>
      <Text variant="caption">{`The lobby opens on ${model.label}. Players join with its code.`}</Text>
      {model.error && <ErrorCallout message={model.error} />}
      <SettingsSection id="new-lobby" title="New lobby" rows={model.rows} />
      <ButtonRow>
        <Button variant="primary" loading={model.busy} onClick={model.create}>Create lobby</Button>
        <Button variant="secondary" disabled={model.busy} onClick={model.cancel}>Cancel</Button>
      </ButtonRow>
    </Stack>
  );
};

export { LobbyCreate };
