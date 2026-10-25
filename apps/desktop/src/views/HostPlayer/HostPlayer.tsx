/* @layer renderer-app @kind component */
import { PanelContainer } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Field, Flex, Icon, Select, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { TEXT } from './HostPlayer.constants';
import type { HostPlayerProps } from './HostPlayer.type';
import { useHostPlayer } from './behavior/useHostPlayer';

const HostPlayer = (props: HostPlayerProps) => {
  const model = useHostPlayer(props);
  return (
    <PanelContainer title="Add my player">
      <Stack gap="sm">
        <Text variant="caption">{TEXT.intro}</Text>
        {model.noGames && <Text variant="caption" tone="dim">{TEXT.noGames}</Text>}
        <Flex align="start" gap="md" wrap>
          <Field label="Game" error={model.gameProblem ?? undefined} width="md">
            <Select value={model.draft.game} options={model.gameOptions} onChange={model.setGame} />
          </Field>
          <Field label="Preset" width="md">
            <Select value={model.draft.presetId} options={model.presetOptions} onChange={model.setPreset} />
          </Field>
          <Field label="Player name" hint={TEXT.name} error={model.nameProblem ?? undefined} width="sm">
            <TextInput value={model.draft.name} onChange={(event) => model.setName(event.target.value)} />
          </Field>
        </Flex>
        {model.error && <ErrorCallout message={model.error} />}
        <ButtonRow>
          <Button variant="primary" icon={<Icon name="plus" />} loading={model.busy} disabled={model.noGames} onClick={model.add}>Add my player</Button>
        </ButtonRow>
      </Stack>
    </PanelContainer>
  );
};

export { HostPlayer };
