/* @layer renderer-app @kind component */
import { ChosenMascot } from '@drizztdourden08/tessera/brand';
import { Button, EmptyState, Icon, Shortcut, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { IdleBaseProps } from './IdleBase.type';
import './IdleBase.css';

const IdleBase = ({ loaded, onOpenSessions }: IdleBaseProps) => (
  <Stack gap="lg" align="center" justify="center" className="idle-base">
    <EmptyState
      icon={<ChosenMascot mascot="pelago" animation="idle" loop size="xl" />}
      message={loaded ? 'No room is hosting right now.' : 'Loading sessions'}
      action={<Button variant="primary" icon={<Icon name="play" />} onClick={onOpenSessions}>Run a session</Button>}
    />
    <Text variant="caption">
      <Shortcut keys="esc" size="xs" /> opens the Multiworld window. <Shortcut keys={['ctrl', 'K']} size="xs" /> searches it.
    </Text>
  </Stack>
);

export { IdleBase };
