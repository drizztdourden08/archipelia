/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Button, ButtonRow, Flex, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import type { LibraryHeaderProps } from './LibraryHeader.type';

const LibraryHeader = ({ query, onQuery, onNew }: LibraryHeaderProps) => {
  const handleQuery = useCallback((event: ChangeEvent<HTMLInputElement>) => onQuery(event.target.value), [onQuery]);
  return (
    <Flex justify="between" align="center" wrap>
      <Stack gap="xs">
        <Text as="h1" variant="title">Sessions</Text>
        <Text variant="caption">A template is a session you can run again. History keeps every run with its outputs.</Text>
      </Stack>
      <ButtonRow>
        <TextInput placeholder="Filter" value={query} onChange={handleQuery} />
        <Button variant="primary" onClick={onNew}>New session</Button>
      </ButtonRow>
    </Flex>
  );
};

export { LibraryHeader };
