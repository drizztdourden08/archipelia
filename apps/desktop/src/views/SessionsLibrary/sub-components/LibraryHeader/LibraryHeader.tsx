/* @layer renderer-app @kind component */
import { Button, ButtonRow, Flex, Icon, SearchInput, Text } from '@drizztdourden08/tessera/primitives';
import type { LibraryHeaderProps } from './LibraryHeader.type';

const LibraryHeader = ({ query, onQuery, onNew }: LibraryHeaderProps) => {
  return (
    <Flex justify="between" align="center" wrap>
      <Text variant="caption">A template is a session you can run again. History keeps every run with its outputs.</Text>
      <ButtonRow>
        <SearchInput placeholder="Filter sessions" aria-label="Filter sessions" value={query} onChange={onQuery} />
        <Button variant="primary" onClick={onNew} icon={<Icon name="plus" />}>New session</Button>
      </ButtonRow>
    </Flex>
  );
};

export { LibraryHeader };
