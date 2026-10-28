/* @layer renderer-app @kind component */
import { widgets } from '@drizztdourden08/brock-react';
import { Button, Icon, Inline, Text } from '@drizztdourden08/tessera/primitives';
import { NETWORK_WIDGET_ID, NETWORK_WIDGET_TEXT } from '../../ArchipeliaServers.constants';
import { reachSummary } from '../../behavior/reach-summary';
import type { ReachSummaryProps } from './ReachSummary.type';

const ReachSummary = ({ status }: ReachSummaryProps) => {
  const summary = reachSummary(status);
  if (summary === null) return null;
  return (
    <Inline gap="sm" align="center" wrap>
      <Text>{summary}</Text>
      <Button size="sm" variant="secondary" icon={<Icon name="network" />} onClick={() => widgets.focus(NETWORK_WIDGET_ID)}>{NETWORK_WIDGET_TEXT.summary}</Button>
    </Inline>
  );
};

export { ReachSummary };
