/* @layer renderer-app @kind component */
import { CodeBlock, FactsPanel } from '@drizztdourden08/tessera/composites';
import { Disclosure, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { OPTION_TEXT } from '../../LobbyMembers.constants';
import type { SlotOptionsViewProps } from '../MemberOptionsDialog/MemberOptionsDialog.type';

const SlotOptionsView = ({ slot, titled }: SlotOptionsViewProps) => (
  <Stack gap="sm" as="section" aria-label={OPTION_TEXT.slot(slot.name, slot.game)}>
    {titled && <Text variant="subtitle">{OPTION_TEXT.slot(slot.name, slot.game)}</Text>}
    {!slot.known && slot.groups.length > 0 && <Text variant="caption" tone="muted">{OPTION_TEXT.notInstalled}</Text>}
    {slot.problem && <Text tone="muted">{slot.problem}</Text>}
    {slot.groups.map((group) => (
      <FactsPanel key={group.name} label={group.name} layout="rows" groups={[group.rows.map((row) => ({ label: row.label, value: row.value }))]} />
    ))}
    {slot.yaml !== null && (
      <Disclosure size="sm" summary={OPTION_TEXT.raw}>
        <CodeBlock code={slot.yaml} language="text" copyable capped />
      </Disclosure>
    )}
  </Stack>
);

export { SlotOptionsView };
