/* @layer renderer-app @kind component */
import { Button, Flex, Stack } from '@drizztdourden08/tessera/primitives';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import { BuildLog } from '../BuildLog';
import { SourceBusy } from '../SourceBusy';
import type { BuildRunningProps } from './BuildRunning.type';

const BuildRunning = ({ text, buildLog, onCancel }: BuildRunningProps) => (
  <Stack gap="md">
    <SourceBusy text={buildLog?.label ? `${text} ${buildLog.label}.` : text} />
    <BuildLog lines={buildLog?.lines ?? []} label={buildLog?.label} />
    {onCancel && (
      <Flex>
        <Button variant="secondary" onClick={onCancel}>{STEP_TEXT.cancel}</Button>
      </Flex>
    )}
  </Stack>
);

export { BuildRunning };
