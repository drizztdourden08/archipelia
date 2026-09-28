/* @layer renderer-app @kind component */
import { Card, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { ProblemListProps } from './ProblemList.type';
import { MAX_SHOWN } from './ProblemList.constants';

const ProblemList = ({ problems }: ProblemListProps) => {
  if (!problems.length) return null;
  const hidden = problems.length - MAX_SHOWN;
  return (
    <Card>
      <Stack gap="xs" role="status">
        <Text variant="label">Before this session can run</Text>
        {problems.slice(0, MAX_SHOWN).map((problem) => (
          <Text key={problem} variant="caption" className="session-builder__problem">{problem}</Text>
        ))}
        {hidden > 0 && <Text variant="caption">and {hidden} more</Text>}
      </Stack>
    </Card>
  );
};

export { ProblemList };
