/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The bar over a list of game options: a search field, a show advanced switch and a tab per option group with its count.',
  useWhen: [
    'Above the options of a preset editor.',
    'Any long list of game options split by the groups of the game schema.',
  ],
  avoidWhen: [
    { case: 'Plain tabs between views with no search.', use: 'Tabs' },
    { case: 'Filters over a table of records.', use: 'FilterBar' },
  ],
  rules: [
    'Keep the active tab, the query and the advanced switch in the view that filters the options.',
    'Give each tab the count of options it shows with the current filter.',
    'Pass advancedCount as 0 to hide the switch when the game has no advanced options.',
  ],
  a11y: [
    'The groups are a tablist; the count reads as a badge on each tab.',
    'The search field is a search input with a placeholder that says what it finds.',
  ],
  tree: {
    path: ['navigation', 'between the option groups of a game'],
    rule: 'Search, advanced switch and group tabs over the options.',
  },
  example: `import { OptionGroupTabs } from '@archipelia/design';

const OptionGroupTabsSample = ({ onTab, onQuery, onAdvanced }: {
  onTab: (id: string) => void;
  onQuery: (query: string) => void;
  onAdvanced: (show: boolean) => void;
}) => (
  <OptionGroupTabs
    tabs={[{ id: 'game', label: 'Game options', count: 12 }]}
    activeTab="game"
    onTabChange={onTab}
    query=""
    onQueryChange={onQuery}
    showAdvanced={false}
    onShowAdvancedChange={onAdvanced}
    advancedCount={4}
  />
);
`,
  propsHash: '8586f5275c04289b',
} satisfies ComponentUsage;

export { usage };
