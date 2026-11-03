/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The frame of a spoiler log tracker: a row of counts, the tabs of the log, the filters and the grouping controls, and a scrolling body for the lists.',
  useWhen: [
    'A parsed spoiler log shown as searchable placements, a playthrough, entrances and settings.',
  ],
  avoidWhen: [
    { case: 'A plain tab strip with no summary above it.', use: 'Tabs' },
  ],
  rules: [
    'Pass stats with a key, a label, a count and an icon. The keys required and others get the warning and info colour.',
    'Pass the app FilterBar as filters, and the group by Select and the compact or detailed toggle as controls.',
    'Put the lists, usually a SpoilerGroups, as children; the body scrolls, the header stays.',
  ],
  a11y: [
    'The counts are a named group, and the tabs follow the Tabs pattern.',
  ],
  tree: {
    path: ['data', 'a spoiler log with its placements'],
    rule: 'The frame around the lists of one spoiler log.',
  },
  example: `import { SpoilerTracker } from '@archipelia/design';

const SpoilerTrackerSample = () => (
  <SpoilerTracker
    stats={[{ key: 'total', label: 'placements', value: 120, icon: 'list' }]}
    tabs={[{ id: 'placements', label: 'Placements' }]}
    activeTab="placements"
    onTabChange={() => undefined}
  >
    {null}
  </SpoilerTracker>
);
`,
  propsHash: 'cfda83a389d28417',
} satisfies ComponentUsage;

export { usage };
