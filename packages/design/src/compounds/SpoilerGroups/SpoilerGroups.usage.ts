/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Collapsible groups of spoiler placements with counts, each group opening to a paged list of rows with an item mark, the location, the item and the receiver.',
  useWhen: [
    'The grouped lists of a spoiler tracker, one level of groups or two.',
  ],
  avoidWhen: [
    { case: 'A tree with no rows or counts.', use: 'GroupTree' },
  ],
  rules: [
    'Pass root as a group whose children are the first level; each group has counts (total, required, others) and rows.',
    'Pass expanded keys and onExpandedChange: groups start collapsed and only expanded groups render rows.',
    'Rows load 200 at a time with a Show more button. The detailed view adds a second line of detail.',
  ],
  a11y: [
    'The groups follow the GroupTree pattern. The item mark is an image with a label.',
  ],
  tree: {
    path: ['data', 'the grouped placements of a spoiler log'],
    rule: 'The expandable groups and rows of one spoiler log.',
  },
  example: `import { SpoilerGroups } from '@archipelia/design';

const SpoilerGroupsSample = () => (
  <SpoilerGroups
    root={{ key: 'root', label: '', counts: [], rows: [], children: [] }}
    view="compact"
    expanded={[]}
    onExpandedChange={() => undefined}
    label="Placements"
    emptyLabel="No placements"
  />
);
`,
  propsHash: '21b24aa51052a3a9',
} satisfies ComponentUsage;

export { usage };
