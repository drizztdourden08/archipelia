/* @layer renderer-app @kind component */
import { useCallback, useState } from 'react';
import { Box, Button, Callout, Flex, PasswordInput, Stack } from '@drizztdourden08/tessera/primitives';
import type { RoomPasswordProps } from './RoomPassword.type';

const RoomPassword = ({ error, onSubmit }: RoomPasswordProps) => {
  const [password, setPassword] = useState('');
  const submit = useCallback(() => {
    if (!password) return;
    onSubmit(password);
    setPassword('');
  }, [password, onSubmit]);
  return (
    <Stack gap="xs">
      <Flex gap="xs">
        <PasswordInput mode="current" autoComplete="off" placeholder="Room password" aria-label="Room password" value={password} onChange={setPassword} onEnter={submit} />
        <Button size="sm" variant="primary" disabled={!password} onClick={submit}>Connect</Button>
      </Flex>
      {error && <Box role="alert"><Callout tone="danger">{error}</Callout></Box>}
    </Stack>
  );
};

export { RoomPassword };
