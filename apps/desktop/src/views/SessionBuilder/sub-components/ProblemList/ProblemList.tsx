/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { MouseEvent } from 'react';
import { Box, Button, Card, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { ProblemListProps } from './ProblemList.type';
import { MAX_SHOWN } from './ProblemList.constants';

const ProblemList = ({ problems, attempted, onShow }: ProblemListProps) => {
  const show = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const problem = problems[Number(event.currentTarget.dataset.index)];
    if (problem) onShow(problem);
  }, [onShow, problems]);
  const hidden = problems.length - MAX_SHOWN;
  return (
    <Box role="status">
      {attempted && problems.length > 0 && (
        <Card>
          <Stack gap="xs">
            <Text variant="label">Before this session can run</Text>
            {problems.slice(0, MAX_SHOWN).map((problem, index) => (
              <Button key={`${index}-${problem.message}`} size="sm" variant="ghost" className="session-builder__problem" data-index={index} onClick={show}>
                <Text as="span" variant="caption" className="session-builder__problem-text">{problem.message}</Text>
              </Button>
            ))}
            {hidden > 0 && <Text variant="caption">and {hidden} more</Text>}
          </Stack>
        </Card>
      )}
    </Box>
  );
};

export { ProblemList };
