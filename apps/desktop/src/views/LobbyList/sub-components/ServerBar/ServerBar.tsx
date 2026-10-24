/* @layer renderer-app @kind component */
import { CopyValue } from '@drizztdourden08/tessera/composites';
import { Callout, Field, Flex, Select } from '@drizztdourden08/tessera/primitives';
import type { ServerBarProps } from '../../LobbyList.type';

const ServerBar = ({ serverId, options, place, notice, onSelect }: ServerBarProps) => (
  <Flex direction="column" gap="sm">
    <Flex align="end" gap="md" wrap>
      <Field label="Server" width="md">
        <Select value={serverId} options={options} onChange={onSelect} />
      </Field>
      {place.address && <Field label="Players join at"><CopyValue value={place.address} label="server address" mono /></Field>}
    </Flex>
    {notice && <Callout tone="warning">{notice}</Callout>}
  </Flex>
);

export { ServerBar };
