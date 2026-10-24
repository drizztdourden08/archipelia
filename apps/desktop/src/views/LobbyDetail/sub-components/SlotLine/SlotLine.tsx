/* @layer renderer-app @kind component */
import { Button, Flex, Inline, Status, Text } from '@drizztdourden08/tessera/primitives';
import { SLOT_STATES } from '../../../../lobbies/lobby-statuses.constants';
import type { SlotLineProps } from './SlotLine.type';

const SlotLine = ({ slot, consent, busy, onReview }: SlotLineProps) => (
  <Flex justify="between" align="center" wrap gap="sm">
    <Inline gap="sm" align="baseline" wrap>
      <Text variant="label">{slot.name}</Text>
      <Text variant="caption" tone="dim">{slot.game}</Text>
      <Status map={SLOT_STATES} value={slot.state} dot />
      {slot.reason && <Text variant="caption" tone="dim">{slot.reason}</Text>}
    </Inline>
    {consent && <Button size="xs" variant="warning" disabled={busy} onClick={() => onReview(consent)}>{`Review the world of ${slot.name}`}</Button>}
  </Flex>
);

export { SlotLine };
