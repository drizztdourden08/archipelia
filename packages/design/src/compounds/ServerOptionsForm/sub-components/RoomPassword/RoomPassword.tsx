/* @layer renderer-app @kind component */
import { Button, Flex, PasswordInput } from '@drizztdourden08/tessera/primitives';
import type { RoomPasswordProps } from './RoomPassword.type';
import { HOST_TEXT } from '../../ServerOptionsForm.constants';

const RoomPassword = ({ password, hasPassword, onPassword, onClearPassword }: RoomPasswordProps) => (
  <Flex gap="sm" align="center">
    <PasswordInput mode="new" value={password} aria-label={HOST_TEXT.password.label} placeholder={hasPassword ? 'stored' : 'optional'} onChange={onPassword} />
    {hasPassword && <Button size="sm" variant="ghost" onClick={onClearPassword}>Clear</Button>}
  </Flex>
);

export { RoomPassword };
