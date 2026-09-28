/* @layer renderer-app @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import type { LogRow } from '@drizztdourden08/tessera/composites';
import { kindOf } from './kind-of';
import { clockOf } from './clock-of';

const serverRows = (lines: readonly HostLogLine[]): LogRow[] => lines.map((line, i) => {
  const kind = kindOf(line.text);
  return { id: `s${i}`, gutter: clockOf(line.at), tag: kind === 'info' ? '' : kind, kind, message: line.text };
});

export { serverRows };
