/* @layer renderer-app @kind component */
import { BrandMark } from '@drizztdourden08/tessera/brand';
import { Button, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { IdleBaseProps } from './IdleBase.type';
import './IdleBase.css';

const IdleBase = ({ loaded, onOpenSessions }: IdleBaseProps) => (
  <Stack gap="lg" align="center" justify="center" className="idle-base">
    <BrandMark app="archipelia" size="xl" />
    <Text variant="body">{loaded ? 'No room is hosting right now.' : 'Loading sessions'}</Text>
    <Button variant="primary" onClick={onOpenSessions}>
      <Icon name="play" />
      Run a session
    </Button>
    <Text variant="caption">Esc opens the Multiworld window. Ctrl+K searches it.</Text>
  </Stack>
);

export { IdleBase };
