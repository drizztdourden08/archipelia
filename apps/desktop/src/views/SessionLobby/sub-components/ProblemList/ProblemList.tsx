/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { MouseEvent } from 'react';
import { Box, Button, Callout, Inline, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { ProblemListProps } from './ProblemList.type';
import { MAX_SHOWN, PROBLEM_TEXT } from './ProblemList.constants';

const ProblemList = ({ problems, attempted, onOpenSlot }: ProblemListProps) => {
  const open = useCallback((event: MouseEvent<HTMLButtonElement>) => onOpenSlot(Number(event.currentTarget.dataset.slot)), [onOpenSlot]);
  const hidden = problems.length - MAX_SHOWN;
  return (
    <Box role="status">
      {attempted && problems.length > 0 && (
        <Callout tone="danger" title={PROBLEM_TEXT.title}>
          <Stack gap="xs">
            {problems.slice(0, MAX_SHOWN).map((problem, index) => (
              <Inline key={`${index}-${problem.message}`} gap="sm" align="center" wrap>
                <Text as="span" variant="caption">{problem.message}</Text>
                <Button size="xs" variant="quiet" data-slot={problem.slot} onClick={open}>
                  {`${PROBLEM_TEXT.open} ${problem.slot}`}
                </Button>
              </Inline>
            ))}
            {hidden > 0 && <Text variant="caption">{`and ${hidden} ${PROBLEM_TEXT.more}`}</Text>}
          </Stack>
        </Callout>
      )}
    </Box>
  );
};

export { ProblemList };
