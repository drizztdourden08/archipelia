/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera/primitives';
import type { GameCardNotesProps } from './GameCardNotes.type';

const GameCardNotes = ({ notes }: GameCardNotesProps) => (
  <Box as="span" className="game-card__notes">
    {notes.map((note) => (
      <Box as="span" key={note.text} className="game-card__note" data-warning={note.warning ? '' : undefined}><Icon name={note.icon} size={14} label={note.text} /></Box>
    ))}
  </Box>
);

export { GameCardNotes };
