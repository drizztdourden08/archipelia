/* @layer renderer-app @kind component */
import { Button, Flex, Stack } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildRunningProps } from '../../PackageSourceDialog.type';
import { BuildLog } from '../BuildLog';
import { SourceBusy } from '../SourceBusy';

const BuildRunning = ({ text, buildLog, onCancel }: BuildRunningProps) => (
  <Stack gap="md">
    <SourceBusy text={buildLog?.label ? `${text} ${buildLog.label}.` : text} />
    <BuildLog lines={buildLog?.lines ?? []} label={buildLog?.label} />
    {onCancel && (
      <Flex>
        <Button variant="secondary" onClick={onCancel}>{BUILD_TEXT.cancel}</Button>
      </Flex>
    )}
  </Stack>
);

export { BuildRunning };
