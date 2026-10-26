/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Button, ButtonRow, Icon, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { SERVER_STATES } from '../../../../lobbies/lobby-statuses.constants';
import { NETWORK_TEXT } from '../../behavior/lobby-view.constants';
import { yourNetwork } from '../../behavior/your-network';
import { networkFacts } from '../../behavior/network-facts';
import { privateFacts } from '../../behavior/private-facts';
import type { NetworkStateProps } from './NetworkState.type';
import { NetworkNotices } from '../NetworkNotices';

const headline = ({ open, status }: Pick<NetworkStateProps, 'open' | 'status'>): string => {
  if (!open) return NETWORK_TEXT.privateNow;
  const lan = yourNetwork(status);
  if (status.state === 'listening' && lan) return `On your network at ${lan}`;
  return status.error ? '' : NETWORK_TEXT.starting;
};

const NetworkState = ({ open, status, busy, onStop }: NetworkStateProps) => {
  const facts = open ? networkFacts(status) : privateFacts(status);
  const line = headline({ open, status });
  return (
    <Stack gap="sm">
      <Status map={SERVER_STATES} value={busy ? 'starting' : status.state} dot />
      <NetworkNotices status={status} open={open} />
      {line !== '' && <Text variant={open ? 'subtitle' : 'caption'}>{line}</Text>}
      {status.state === 'listening' && facts.length > 0 && <FactsPanel label={open ? 'Addresses' : 'Address'} groups={[facts]} layout="boxed" />}
      {open && (
        <ButtonRow>
          <Button variant="secondary" icon={<Icon name="square" />} loading={busy} onClick={onStop}>Stop</Button>
        </ButtonRow>
      )}
    </Stack>
  );
};

export { NetworkState };
