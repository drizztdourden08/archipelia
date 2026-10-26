/* @layer renderer-app @kind component */
import { Button, Flex, Stack } from '@drizztdourden08/tessera/primitives';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildRunningProps } from '../../PackageSourceDialog.type';
import { BuildLog } from '../BuildLog';
import { SourceBusy } from '../SourceBusy';

const BuildRunning = ({ text, buildLog, onBuildCancel }: BuildRunningProps) => (
  <Stack gap="md">
    <SourceBusy text={buildLog?.label ? `${text} ${buildLog.label}.` : text} />
    <BuildLog lines={buildLog?.lines ?? []} label={buildLog?.label} />
    <Flex>
      <Button variant="secondary" onClick={onBuildCancel}>{BUILD_TEXT.cancel}</Button>
    </Flex>
  </Stack>
);

export { BuildRunning };
