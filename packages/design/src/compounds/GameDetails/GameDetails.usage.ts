/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The full information of one Archipelago world in a dialog: its kind, version and state, its description, art, notes and tags, and the same Add, Update and Remove actions as its card.',
  useWhen: [
    'The user opens a GameCard to read more about a world before adding, updating or removing it.',
  ],
  avoidWhen: [
    { case: 'A world in the grid of the games store.', use: 'GameCard' },
    { case: 'A question that needs a yes or a no.', use: 'Dialog' },
  ],
  rules: [
    'Show it only for the world the user opened, and close it with onClose; Escape and the close button call it too.',
    'Pass the same title, kind, version, status, notes, tags and actions as the card, so the card and the dialog never disagree.',
    'Pass details with the long text and summary with the short one; the dialog shows details first. Leave both out while the description is not read and set loading, so it reads Reading the description.',
    'While a world is busy, pass busy with the sentence, such as Adding Timespinner..., and the actions give way to a spinner with that sentence.',
    'Pass error with the reason the last action failed, in the words the main process gave; it shows in the dialog next to the world.',
    'Never pass markup in the text.',
  ],
  a11y: [
    'The dialog is modal and named by the title of the world.',
    'Focus moves into the dialog on open and returns to the card on close.',
    'The error is an alert.',
    'The busy sentence is read by a screen reader as the dialog changes.',
  ],
  tree: {
    path: ['something over the page', 'a dialog with its own layout'],
    rule: 'One world to read about, then add, update or remove.',
  },
  example: `import { GameDetails } from '@archipelia/design';

const GameDetailsSample = ({ onClose, onInstall }: { onClose: () => void; onInstall: () => void }) => (
  <GameDetails
    title="Timespinner"
    kind="community"
    kindLabel="Community world"
    version="1.2.0"
    notes={[]}
    tags={['time']}
    summary="Travel through time in a metroidvania."
    actions={[{ id: 'install', label: 'Add', icon: 'download', primary: true, onClick: onInstall }]}
    onClose={onClose}
  />
);
`,
  propsHash: 'ba4b06ce24ac839c',
} satisfies ComponentUsage;

export { usage };
