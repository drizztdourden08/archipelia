/* @layer renderer-app @kind component */
import { formatBytes } from '@drizztdourden08/brock-core/format';
import { FactsPanel, ListItemList, ListItemRow, PanelContainer } from '@drizztdourden08/tessera/composites';
import { Callout, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { resultsFacts } from '../../behavior/results-facts';
import type { ResultsPanelProps } from './ResultsPanel.type';

const ResultsPanel = ({ lobby, onThisComputer }: ResultsPanelProps) => {
  const { room, failure } = lobby;
  return (
    <PanelContainer title="Results">
      <Stack gap="sm">
        {failure && <Callout tone="danger">{`The ${failure.stage === 'generate' ? 'generation' : 'room'} failed: ${failure.message}`}</Callout>}
        {room && <FactsPanel label="Room" groups={[resultsFacts(lobby, onThisComputer)]} layout="boxed" />}
        {room?.files.length === 0 && <Text variant="caption" tone="dim">The seed made no files for the players.</Text>}
        {room && room.files.length > 0 && (
          <ListItemList label="Files for the players" heading="Files for the players" count={room.files.length}>
            {room.files.map((file) => (
              <ListItemRow key={file.fileId} name={file.name} meta={file.slot} columns={[{ primary: formatBytes(file.size), align: 'end' }]} />
            ))}
          </ListItemList>
        )}
      </Stack>
    </PanelContainer>
  );
};

export { ResultsPanel };
