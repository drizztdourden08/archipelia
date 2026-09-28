/* @layer renderer-app @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';

const engineLogRows = (lines: string[]): LogRow[] =>
  lines.map((line, index) => ({ id: String(index), gutter: String(index + 1), tag: 'engine', kind: 'engine', message: line }));

export { engineLogRows };
