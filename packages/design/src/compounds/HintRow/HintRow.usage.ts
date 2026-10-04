/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'One hint of a live room: whose item it is, where it sits in whose world, and whether it is found.',
  useWhen: [
    'The hints list of a hosted room.',
    'Any list of Archipelago hints read from a room.',
  ],
  avoidWhen: [
    { case: 'A player of the room with their checks.', use: 'PlayerStatusRow' },
    { case: 'A raw line of the server log.', use: 'LogLines' },
  ],
  rules: [
    'Pass the names as the room reports them; the row writes the sentence around them.',
    'Leave entrance empty when the hint has none.',
    'Pick stateTone from the hint state: success for found, warning for not found yet.',
  ],
  a11y: [
    'The row is a list item, so place it inside a list.',
    'The state is text in a Status, read after the item and its place.',
  ],
  tree: {
    path: ['data', 'a hint in a live room'],
    rule: 'One hint with its finder, place and state.',
  },
  example: `import { HintRow } from '@archipelia/design';

const HintRowSample = () => (
  <div role="list">
    <HintRow item="Double Jump" receiver="Ana" finder="Ben" location="Lake Desolation" entrance="" state="not found" stateTone="warning" />
  </div>
);
`,
  propsHash: 'cf5b38f752aeae78',
} satisfies ComponentUsage;

export { usage };
