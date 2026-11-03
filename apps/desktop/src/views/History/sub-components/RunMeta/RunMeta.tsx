/* @layer renderer-app @kind component */
import { Stack, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { runChip } from '../../behavior/run-chip';
import { runSummary } from '../../behavior/run-summary';
import { DATE_FORMAT } from '../../History.constants';
import type { RunMetaProps } from './RunMeta.type';

const RunMeta = ({ run }: RunMetaProps) => {
  const chip = runChip(run);
  const summary = runSummary(run);
  return (
    <Stack gap="xs">
      <Text variant="caption">{DATE_FORMAT.format(run.createdAt)}{run.seed ? ` · seed ${run.seed}` : ''}</Text>
      {summary && <Text variant="caption">{summary}</Text>}
      <Tag color={chip.recorded ? 'secondary' : 'neutral'}>{chip.text}</Tag>
    </Stack>
  );
};

export { RunMeta };
