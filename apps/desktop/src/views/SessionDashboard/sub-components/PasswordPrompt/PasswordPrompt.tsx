/* @layer renderer-app @kind component */
import { useCallback, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Box, Button, Callout, Flex, PasswordInput, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { PasswordPromptProps } from './PasswordPrompt.type';

const PasswordPrompt = ({ error, onSubmit }: PasswordPromptProps) => {
  const [password, setPassword] = useState('');
  const submit = useCallback(() => {
    if (!password) return;
    onSubmit(password);
    setPassword('');
  }, [password, onSubmit]);
  const keyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => { if (event.key === 'Enter') submit(); }, [submit]);
  return (
    <Stack gap="xs">
      <Text variant="body">This room has a password: enter it to watch.</Text>
      <Flex gap="xs">
        <PasswordInput mode="current" autoComplete="off" placeholder="Room password" aria-label="Room password" value={password} onChange={setPassword} onKeyDown={keyDown} />
        <Button size="sm" variant="primary" disabled={!password} onClick={submit}>Watch</Button>
      </Flex>
      {error && <Box role="alert"><Callout tone="danger">{error}</Callout></Box>}
    </Stack>
  );
};

export { PasswordPrompt };
