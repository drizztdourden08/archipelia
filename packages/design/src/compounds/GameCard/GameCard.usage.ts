/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One Archipelago world in the games store: its source, its install state, a few detail lines and the actions on it.',
  useWhen: [
    'A world in the grid of the games store, installed or not.',
    'Any card that offers to install, update or remove one world.',
  ],
  avoidWhen: [
    { case: 'A world in a dense list with one action, such as a preset picker.', use: 'ListItemRow' },
    { case: 'A headline number with its trend.', use: 'StatTile' },
  ],
  rules: [
    'Keep details to short lines, such as the world version and the Archipelago version it needs.',
    'Mark at most one action primary: the next step for that world.',
    'Pass status only when the world is installed or has an update; leave it out for a world not installed.',
    'Disable an action while that world is busy; never hide it.',
    'Mark the action that is running as loading, with a label that says what runs, so only that card shows the work.',
    'Mark an action that deletes something as danger.',
  ],
  a11y: [
    'The card is a group named after the world title.',
    'Each action button is named with the action and the world, such as Add Timespinner.',
    'A loading action is busy and turned off until its work ends.',
  ],
  tree: {
    path: ['data', 'a game in the store'],
    rule: 'One world to install, update or remove.',
  },
  example: `import { GameCard } from '@archipelia/design';

const GameCardSample = ({ onInstall }: { onInstall: () => void }) => (
  <GameCard
    title="Timespinner"
    source="Official"
    status={{ label: 'update', tone: 'warning' }}
    details={['World 1.2.0', 'For AP 0.6.7']}
    actions={[{ label: 'Update', onClick: onInstall, variant: 'primary' }]}
  />
);
`,
  propsHash: '973f866b6b077843',
} satisfies ComponentUsage;

export { usage };
