/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A card with one headline value, its heading, a meta line and at most one action.',
  useWhen: [
    'A count or size on an overview, such as games installed or space used.',
    'A summary tile that leads to the page where the value can change.',
  ],
  avoidWhen: [
    { case: 'A label and its value inside a list or a card.', use: 'StatRow' },
    { case: 'Several facts grouped under headings.', use: 'FactsPanel' },
  ],
  rules: [
    'Keep value short: a number or a size with its unit.',
    'Use meta for the context of the value, not for a second value.',
    'Give an action only when it leads somewhere useful from that value.',
  ],
  a11y: [
    'The heading is a label read before the value.',
    'The action is a plain button with its own label.',
  ],
  tree: {
    path: ['a status, a count or a label', 'one headline number in a card'],
    rule: 'One value large in a card.',
  },
  example: `import { StatCard } from '@archipelia/design';

const StatCardSample = ({ onOpen }: { onOpen: () => void }) => (
  <StatCard heading="Games" value="12" meta="3 with updates" action={{ label: 'Open games', onClick: onOpen }} />
);
`,
  propsHash: 'a1c55e9adefc902e',
} satisfies ComponentUsage;

export { usage };
