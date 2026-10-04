/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A searchable log panel for the lines of a session, with optional tabs to switch between its logs.',
  useWhen: [
    'The server, generation or spoiler log of a session.',
    'A widget that shows the lines of one of several logs, picked by tab.',
  ],
  avoidWhen: [
    { case: 'A single log with no tabs and no search state of its own.', use: 'LogPanel' },
    { case: 'Code or a report to copy whole.', use: 'CodeBlock' },
  ],
  rules: [
    'Keep the search text in the view that owns the rows and pass onSearchChange.',
    'Pass tabs, activeTab and onTabChange together, or none of them.',
    'Give an emptyLabel that says why there is nothing yet, such as No output yet.',
    'Copy all copies the lines the filter shows, with their time and tag; pass copyText only to copy them another way.',
    'Pass placeholder, such as a Spinner in an EmptyState or an ErrorCallout, to show it under the tabs in place of the lines while they load or when they could not be read.',
    'Put an action about the whole log, such as Hide spoiler, in toolbarExtra.',
    'Render it as the whole body of a widget whose meta sets fill, so the log fills the widget below the tabs.',
  ],
  a11y: [
    'The tabs are a tablist when given.',
    'The search field and the copy button come from LogPanel with their own labels.',
  ],
  tree: {
    path: ['data', 'a stream of log lines'],
    rule: 'A session log with search and tabs.',
  },
  example: `import { LogLines } from '@archipelia/design';

const LogLinesSample = ({ onSearch }: { onSearch: (query: string) => void }) => (
  <LogLines
    rows={[{ id: '1', gutter: '12:00', tag: 'server', kind: 'info', message: 'Hosting on port 38281' }]}
    search=""
    onSearchChange={onSearch}
    emptyLabel="No output yet"
  />
);
`,
  propsHash: '6b4e01dfb8440341',
} satisfies ComponentUsage;

export { usage };
