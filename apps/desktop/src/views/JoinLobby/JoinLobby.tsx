/* @layer renderer-app @kind component */
import { PanelContainer } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Field, Flex, Icon, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { TEXT } from './JoinLobby.constants';
import { useJoinLobby } from './behavior/useJoinLobby';
import { FoundServers } from './sub-components/FoundServers';
import { ProbeResult } from './sub-components/ProbeResult';

const JoinLobby = () => {
  const model = useJoinLobby();
  return (
    <PanelContainer title="Join a lobby">
      <Stack gap="sm">
        <Text variant="caption">{TEXT.intro}</Text>
        <ButtonRow>
          <Button size="sm" variant="secondary" icon={<Icon name="search" />} onClick={model.toggleLooking}>
            {model.looking ? 'Stop looking' : 'Find servers on my network'}
          </Button>
        </ButtonRow>
        <FoundServers servers={model.servers} looking={model.looking} selected={model.address} onPick={model.pick} />
        <Flex align="end" gap="md" wrap>
          <Field label="Server address" hint="host:port, such as 192.168.1.20:38290" error={model.addressProblem ?? undefined} width="md">
            <TextInput value={model.address} onChange={(event) => model.setAddress(event.target.value)} />
          </Field>
          <Field label="Lobby code" hint="Such as K7QM-4XT2" width="sm">
            <TextInput value={model.code} onChange={(event) => model.setCode(event.target.value)} />
          </Field>
          <Button variant="primary" loading={model.checking} disabled={!model.canCheck} onClick={() => void model.check()}>Look at the lobby</Button>
        </Flex>
        {model.error && <ErrorCallout message={model.error} />}
        {model.probe && <ProbeResult probe={model.probe} />}
      </Stack>
    </PanelContainer>
  );
};

export { JoinLobby };
