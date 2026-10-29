/* @layer renderer-app @kind component */
import { useId } from 'react';
import { Box, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { SetupRowProps } from './SetupRow.type';
import './SetupRow.css';

const SetupRow = ({ label, hint, problem, children }: SetupRowProps) => {
  const labelId = useId();
  return (
    <Box role="group" aria-labelledby={labelId} className="setup-row">
      <Text id={labelId} variant="label" tone="dim" className="setup-row__label">{label}</Text>
      <Stack gap="xs" className="setup-row__body">
        {children}
        {problem && <Text variant="caption" tone="danger">{problem}</Text>}
        {!problem && hint && <Text variant="caption" tone="muted">{hint}</Text>}
      </Stack>
    </Box>
  );
};

export { SetupRow };
