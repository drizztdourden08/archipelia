/* @layer renderer-app @kind component */
import { CopyValue } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Callout, Field, Flex, Icon, Select, Text } from '@drizztdourden08/tessera/primitives';
import { TEXT } from '../../HostChoice.constants';
import type { RemoteChoiceProps } from '../../HostChoice.type';

const RemoteChoice = ({ serverId, entries, place, stillOpen, busy, onSelect, onStop, onManage }: RemoteChoiceProps) => (
  <Flex direction="column" gap="sm">
    {entries.length === 0 && <Text variant="caption">{TEXT.noRemote}</Text>}
    {entries.length > 0 && (
      <Flex align="end" gap="md" wrap>
        <Field label="Server" width="md">
          <Select value={serverId} options={entries.map((entry) => ({ value: entry.id, label: entry.label }))} onChange={onSelect} />
        </Field>
        {place.address && <Field label="Players join at"><CopyValue value={place.address} label="server address" mono /></Field>}
      </Flex>
    )}
    {stillOpen && <Callout tone="info">{TEXT.stillOpen}</Callout>}
    <ButtonRow>
      <Button size="sm" variant="secondary" icon={<Icon name="server" />} onClick={onManage}>Manage servers</Button>
      {stillOpen && <Button size="sm" variant="secondary" icon={<Icon name="square" />} loading={busy} onClick={onStop}>Stop the network</Button>}
    </ButtonRow>
  </Flex>
);

export { RemoteChoice };
