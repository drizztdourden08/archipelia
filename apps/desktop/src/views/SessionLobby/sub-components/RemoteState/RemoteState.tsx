/* @layer renderer-app @kind component */
import { nav } from '@drizztdourden08/brock-react';
import { CopyValue } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Callout, Field, Flex, Icon } from '@drizztdourden08/tessera/primitives';
import { ROUTE } from '../../../../hooks/app-navigation.constants';
import { useServerPlace } from '../../../../hooks/useServerPlace';
import { NETWORK_TEXT } from '../../behavior/lobby-view.constants';
import type { RemoteStateProps } from './RemoteState.type';

const RemoteState = ({ serverId, stillOpen, busy, onStop }: RemoteStateProps) => {
  const place = useServerPlace(serverId);
  return (
    <Flex direction="column" gap="sm">
      {place.address && <Field label="Players join at"><CopyValue value={place.address} label="server address" mono /></Field>}
      {stillOpen && <Callout tone="info">{NETWORK_TEXT.stillOpen}</Callout>}
      <ButtonRow>
        <Button size="sm" variant="secondary" icon={<Icon name="server" />} onClick={() => nav.open(ROUTE.archipeliaServers)}>Manage servers</Button>
        {stillOpen && <Button size="sm" variant="secondary" icon={<Icon name="square" />} loading={busy} onClick={onStop}>Stop</Button>}
      </ButtonRow>
    </Flex>
  );
};

export { RemoteState };
