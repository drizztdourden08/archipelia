/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Card, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { JoinCardProps } from '../../JoinSession.type';
import { resultFacts } from '../../behavior/result-facts';
import { JoinButtons } from '../JoinButtons';
import { JoinStatus } from '../JoinStatus';

const JoinCard = (props: JoinCardProps) => {
  const { join } = props;
  const name = join.lobbyName ?? join.code;
  return (
    <Card title={name} subtitle={`${join.slotName} · ${join.game} · ${join.address}`} actions={<JoinButtons {...props} />} level={3}>
      <Stack gap="sm">
        <JoinStatus join={join} />
        {join.message && <Text variant="caption">{join.message}</Text>}
        {join.results && <FactsPanel label={`${name} room`} groups={[resultFacts(join.results)]} layout="boxed" />}
      </Stack>
    </Card>
  );
};

export { JoinCard };
