/* @layer renderer-app @kind component */
import { Stack, Tag, Text, Tooltip } from '@drizztdourden08/tessera/primitives';
import { changesLabel } from '../../behavior/changes-label';
import type { ChangesChipProps } from './ChangesChip.type';

const ChangesChip = ({ changes }: ChangesChipProps) => {
  if (changes.length === 0) return null;
  const lines = (
    <Stack gap="xs">
      {changes.map((change) => <Text key={`${change.field}:${change.to}`} variant="caption">{`${change.label}: ${change.from} to ${change.to}`}</Text>)}
    </Stack>
  );
  return (
    <Tooltip content={lines} focusable>
      <Tag color="secondary">{changesLabel(changes.length)}</Tag>
    </Tooltip>
  );
};

export { ChangesChip };
