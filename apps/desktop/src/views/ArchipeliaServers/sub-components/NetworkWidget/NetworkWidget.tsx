/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Button, Callout, Inline, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { SERVER_STATES } from '../../../../lobbies/lobby-statuses.constants';
import { NETWORK_WIDGET_TEXT } from '../../ArchipeliaServers.constants';
import { useNetworkWidget } from '../../behavior/useNetworkWidget';
import { LocalNotices } from '../LocalNotices';
import type { NetworkWidgetProps } from './NetworkWidget.type';

const NetworkWidget = ({ network }: NetworkWidgetProps) => {
  const model = useNetworkWidget(network);
  const { status } = model;
  const stop = <Button size="sm" variant="secondary" disabled={model.busy} onClick={model.stop}>{NETWORK_WIDGET_TEXT.stop}</Button>;
  return (
    <Stack gap="sm">
      <Inline gap="sm" align="center">
        <Text variant="label">{NETWORK_WIDGET_TEXT.server}</Text>
        <Status map={SERVER_STATES} value={status?.state} fallback="starting" dot />
      </Inline>
      <LocalNotices status={status} error={model.error} />
      {model.open && <Callout tone="info" action={stop}>{NETWORK_WIDGET_TEXT.open}</Callout>}
      {model.facts.length > 0 && <FactsPanel label={NETWORK_WIDGET_TEXT.reach} groups={[model.facts]} layout="boxed" />}
      {network.facts.length > 0 && <FactsPanel label={NETWORK_WIDGET_TEXT.session} groups={[network.facts]} layout="boxed" />}
    </Stack>
  );
};

export { NetworkWidget };
