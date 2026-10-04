/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A server console: the commands sent and the reply of the server under each one, above a command line with its history and quick commands.',
  useWhen: [
    'A widget that sends commands to a hosted room and shows what the room answered.',
    'Any command line whose replies belong under the command that asked for them.',
  ],
  avoidWhen: [
    { case: 'The whole log of a session, with search and tabs.', use: 'LogLines' },
    { case: 'A command line with no replies to show.', use: 'CommandInput' },
  ],
  rules: [
    'Pass rows in the order they happened, each command row followed by its reply rows; use the kinds command, reply and error.',
    'Keep the sent commands in the view and pass them as history, oldest first, so Up and Down walk them.',
    'Return false from onSubmit when the command was not sent, so the text stays in the line.',
    'Put quick commands, such as Save, in actions as small buttons that send through the same path.',
    'Only the last CONSOLE_ROW_LIMIT rows show; pass limit only to keep fewer.',
    'Render it in a widget whose meta sets fill, so the replies fill the space above the line.',
  ],
  a11y: [
    'The command line is named by label, or Command, and its key hints describe it.',
    'Send is a labelled button that stays off while the line is empty or the console is disabled.',
  ],
  tree: {
    path: ['a value the user sets', 'free text or a number', 'a command, with its history'],
    rule: 'A command line with the reply of the server under each command.',
  },
  example: `import { CommandConsole } from '@archipelia/design';

const CommandConsoleSample = ({ send }: { send: (command: string) => void }) => (
  <CommandConsole
    rows={[
      { id: '1', gutter: '12:00', tag: '', kind: 'command', message: '> /players' },
      { id: '2', gutter: '', tag: '', kind: 'reply', message: '2 players of 2 connected', indent: 1 },
    ]}
    history={['/players']}
    label="Server command"
    onSubmit={send}
  />
);
`,
  propsHash: '78490c15faa93941',
} satisfies ComponentUsage;

export { usage };
