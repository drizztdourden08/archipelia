/* @layer renderer-app @kind component */
import { LogPanel } from '@drizztdourden08/tessera/composites';
import { Box, Callout, Flex, ProgressBar, Stack, Stepper, Tag, Text } from '@drizztdourden08/tessera/primitives';
import { logCopyText } from '../LogLines';
import { RUN_LOG_KINDS } from './RunProgressPanel.constants';
import type { RunProgressPanelProps } from './RunProgressPanel.type';
import { stepperOf } from './behavior/stepper-of';
import './RunProgressPanel.css';

const RunProgressPanel = ({ percent, line, steps, failed, error, seed, logRows, showLog, logEmpty }: RunProgressPanelProps) => (
  <Stack gap="md" className="run-progress-panel">
    <Flex justify="between" align="center" gap="sm">
      <Text variant="caption" className="run-progress-panel__line">{line}</Text>
      {seed && <Tag>seed {seed}</Tag>}
    </Flex>
    <ProgressBar value={percent} max={100} tone={failed ? 'danger' : 'primary'} live={!failed} />
    <Stepper orientation="vertical" reserve="none" label="Run steps" {...stepperOf(steps, failed)} />
    {error && <Box role="alert"><Callout tone="danger">{error}</Callout></Box>}
    {showLog && (
      <Box className="run-progress-panel__log">
        <LogPanel rows={logRows} kinds={RUN_LOG_KINDS} copyText={logCopyText} countLabel="lines" emptyLabel={logEmpty} />
      </Box>
    )}
  </Stack>
);

export { RunProgressPanel };
