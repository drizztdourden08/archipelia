/* @layer renderer-app @kind component */
import { Button, ButtonRow, Flex, Icon, SearchInput, Text } from '@drizztdourden08/tessera/primitives';
import type { LibraryHeaderProps } from './LibraryHeader.type';

const LibraryHeader = ({ query, onQuery, onNew }: LibraryHeaderProps) => {
  return (
    <Flex justify="between" align="center" wrap>
      <Text variant="caption">A session is a saved setup you can run again. Each run makes a seed and a room, kept in Runs with its files.</Text>
      <ButtonRow>
        <SearchInput placeholder="Filter sessions and runs" aria-label="Filter sessions and runs" value={query} onChange={onQuery} />
        <Button variant="primary" onClick={onNew} icon={<Icon name="plus" />}>New session</Button>
      </ButtonRow>
    </Flex>
  );
};

export { LibraryHeader };
