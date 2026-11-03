/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { slotsSummary } from '../../behavior/slots-summary';
import { SLOTS_TEXT } from '../../SessionBuilder.constants';
import type { SlotsSummaryProps } from './SlotsSummary.type';

const SlotsSummary = ({ players }: SlotsSummaryProps) => (
  <Stack as="section" gap="xs" aria-label={SLOTS_TEXT.heading}>
    <Text variant="overline" tone="muted">{SLOTS_TEXT.heading}</Text>
    <Text variant="body" tone="dim">{slotsSummary(players)}</Text>
    <Text variant="caption" tone="muted">{SLOTS_TEXT.where}</Text>
  </Stack>
);

export { SlotsSummary };
