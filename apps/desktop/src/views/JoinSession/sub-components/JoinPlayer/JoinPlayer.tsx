/* @layer renderer-app @kind component */
import { PanelContainer } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Field, Flex, Icon, Select, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { DISPLAY_LIMIT, NAME_LIMIT, TEXT, YAML_VALUE } from '../../JoinSession.constants';
import type { JoinPlayerProps } from '../../JoinSession.type';
import { useJoinPlayer } from '../../behavior/useJoinPlayer';

const JoinPlayer = (props: JoinPlayerProps) => {
  const model = useJoinPlayer(props);
  const { draft, problems } = model;
  return (
    <PanelContainer title={TEXT.player}>
      <Stack gap="sm">
        <Text variant="caption">{props.installed.length === 0 ? TEXT.noGames : TEXT.playerIntro}</Text>
        <Flex align="start" gap="md" wrap>
          <Field label="Game" error={problems.game ?? undefined} width="md">
            <Select value={draft.game} options={model.gameOptions} onChange={model.setGame} searchable />
          </Field>
          <Field label="Options" error={problems.file ?? undefined} hint={draft.file?.fileName} width="md">
            <Select value={draft.source} options={model.sourceOptions} onChange={model.setSource} />
          </Field>
          <Field label="Player name" error={problems.slotName ?? undefined} width="sm">
            <TextInput value={draft.slotName} maxLength={NAME_LIMIT} onChange={(event) => model.setSlotName(event.target.value)} />
          </Field>
          <Field label="Your name" error={problems.displayName ?? undefined} width="sm">
            <TextInput value={draft.displayName} maxLength={DISPLAY_LIMIT} onChange={(event) => model.setDisplayName(event.target.value)} />
          </Field>
        </Flex>
        {model.error && <ErrorCallout message={model.error} />}
        <ButtonRow>
          {draft.source === YAML_VALUE && <Button variant="secondary" icon={<Icon name="file" />} onClick={() => void model.pickFile()}>Choose a player file</Button>}
          <Button variant="primary" icon={<Icon name="log-in" />} loading={model.busy} disabled={!props.target.ready || props.installed.length === 0} onClick={model.join}>
            Join as a player
          </Button>
        </ButtonRow>
      </Stack>
    </PanelContainer>
  );
};

export { JoinPlayer };
