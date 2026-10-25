/* @layer renderer-app @kind component */
import { Inline, Status, Text } from '@drizztdourden08/tessera/primitives';
import { JOIN_STATES } from '../../../../joins/joins.constants';
import { SLOT_STATES } from '../../../../lobbies/lobby-statuses.constants';
import type { JoinStatusProps } from '../../JoinSession.type';

const JoinStatus = ({ join }: JoinStatusProps) => (
  <Inline gap="sm" align="center" wrap>
    <Status map={JOIN_STATES} value={join.state} dot />
    {join.slotState && <Status map={SLOT_STATES} value={join.slotState} dot />}
    {join.ap && <Text variant="caption" tone="dim">{`Archipelago ${join.ap}`}</Text>}
  </Inline>
);

export { JoinStatus };
