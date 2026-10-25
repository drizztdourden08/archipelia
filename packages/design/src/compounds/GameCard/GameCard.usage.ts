/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One Archipelago world in the games store as a compact Tessera ItemCard: its kind as an icon, its name, its world version, its state and icon actions.',
  useWhen: [
    'A world in the grid of the games store, installed or not.',
    'Any card that offers to install, update or remove one world.',
  ],
  avoidWhen: [
    { case: 'A world in a dense list with one action, such as a preset picker.', use: 'ListItemRow' },
    { case: 'A headline number with its trend.', use: 'StatTile' },
  ],
  rules: [
    'Say what kind of world it is with the kind icon and its tint, never with a word on the card; kindLabel is the hint of the icon.',
    'Show the world version once, such as 1.2.0 or 1.0.0 to 1.2.1 for an update.',
    'Pass one status only: installed, update, no release yet or not available. Leave it out for a world that is only there to add.',
    'Put detail that is rare or long in a note, shown as an icon with a hint, and leave out what every card would repeat.',
    'Mark at most one action primary: the next step for that world.',
    'Disable an action while that world is busy; never hide it.',
    'Mark the action that is running as loading, so only that card shows the work.',
    'Mark an action that deletes something as danger.',
    'Pass summary as one plain text description, shown on the one detail line after the version, the notes and the tags; pass summaryHint with the longer text for the hint. Never pass markup.',
    'Pass art as a small picture of the world, a data address, and it fills the media tile with the kind icon as a badge; leave it out and the tile shows the kind icon alone.',
  ],
  a11y: [
    'The title of the card is a level 3 heading.',
    'Each icon button is named by its action, such as Add, and shows the same name as a hint.',
    'Each note is a named image with a hint that opens on focus; the kind tile is hidden from screen readers and its hint opens on hover.',
    'A loading action is turned off until its work ends.',
  ],
  tree: {
    path: ['data', 'a game in the store'],
    rule: 'One world to install, update or remove.',
  },
  example: `import { GameCard } from '@archipelia/design';

const GameCardSample = ({ onInstall }: { onInstall: () => void }) => (
  <GameCard
    title="Timespinner"
    kind="community"
    kindLabel="Community world"
    version="1.0.0 to 1.2.0"
    status="update"
    notes={[]}
    tags={[]}
    actions={[{ id: 'update', label: 'Update', icon: 'download', primary: true, onClick: onInstall }]}
  />
);
`,
  propsHash: '1997f4629b33569c',
} satisfies ComponentUsage;

export { usage };
