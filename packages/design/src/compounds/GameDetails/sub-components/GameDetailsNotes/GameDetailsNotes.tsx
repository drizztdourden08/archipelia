/* @layer renderer-app @kind component */
import { Box, Flex, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { GameDetailsNotesProps } from './GameDetailsNotes.type';

const GameDetailsNotes = ({ notes }: GameDetailsNotesProps) => (
  <Stack gap="xs" as="ul" className="game-details__notes">
    {notes.map((note) => (
      <Flex as="li" key={note.text} align="center" gap="xs">
        <Box as="span" className="game-details__note" data-warning={note.warning ? '' : undefined}><Icon name={note.icon} size={14} /></Box>
        <Text variant="caption">{note.text}</Text>
      </Flex>
    ))}
  </Stack>
);

export { GameDetailsNotes };
