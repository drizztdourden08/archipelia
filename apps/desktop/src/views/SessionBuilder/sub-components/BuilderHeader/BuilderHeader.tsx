/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Flex, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import type { BuilderHeaderProps } from './BuilderHeader.type';

const BuilderHeader = ({ name, saved, changes, onName, children }: BuilderHeaderProps) => {
  const handleName = useCallback((event: ChangeEvent<HTMLInputElement>) => onName(event.target.value), [onName]);
  return (
    <Stack gap="xs">
      <Flex gap="sm" align="center" wrap>
        <TextInput aria-label="Session name" value={name} placeholder="Session name" onChange={handleName} />
        {saved && <Text variant="caption">Saved</Text>}
        {changes && <Text variant="caption" tone="dim">{changes}</Text>}
      </Flex>
      {children}
    </Stack>
  );
};

export { BuilderHeader };
