/* @layer renderer-app @kind component */
import { Button, Flex } from '@drizztdourden08/tessera/primitives';
import { PasswordInput } from '@drizztdourden08/tessera/composites';
import type { PasswordControlProps } from './PasswordControl.type';
import { DIRECT_TEXT } from '../../behavior/place.constants';

const PasswordControl = ({ password, hasPassword, onPassword, onClearPassword }: PasswordControlProps) => (
  <Flex gap="sm" align="center">
    <PasswordInput mode="new" value={password} aria-label={DIRECT_TEXT.password.title} placeholder={hasPassword ? 'stored' : 'optional'} onChange={onPassword} />
    {hasPassword && <Button size="sm" variant="ghost" onClick={onClearPassword}>Clear</Button>}
  </Flex>
);

export { PasswordControl };
