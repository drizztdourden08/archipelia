/* @layer renderer-app @kind component */
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import { Card, Inline, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { JOIN_STATES } from '../../../../joins/joins.constants';
import { SLOT_STATES } from '../../../../lobbies/lobby-statuses.constants';
import type { JoinCardProps } from '../../JoinSession.type';
import { resultFacts } from '../../behavior/result-facts';
import { JoinButtons } from '../JoinButtons';

const JoinCard = (props: JoinCardProps) => {
  const { join } = props;
  const name = join.lobbyName ?? join.code;
  return (
    <Card title={name} subtitle={`${join.slotName} · ${join.game} · ${join.address}`} actions={<JoinButtons {...props} />} level={3}>
      <Stack gap="sm">
        <Inline gap="sm" align="center" wrap>
          <Status map={JOIN_STATES} value={join.state} dot />
          {join.slotState && <Status map={SLOT_STATES} value={join.slotState} dot />}
          {join.ap && <Text variant="caption" tone="dim">{`Archipelago ${join.ap}`}</Text>}
        </Inline>
        {join.message && <Text variant="caption">{join.message}</Text>}
        {join.results && <FactsPanel label={`${name} room`} groups={[resultFacts(join.results)]} layout="boxed" />}
      </Stack>
    </Card>
  );
};

export { JoinCard };
