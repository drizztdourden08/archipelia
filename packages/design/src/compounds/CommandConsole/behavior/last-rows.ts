/* @layer renderer-app @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';

const lastRows = (rows: readonly LogRow[], limit: number): readonly LogRow[] =>
  (rows.length > limit ? rows.slice(rows.length - Math.max(0, limit)) : rows);

export { lastRows };
