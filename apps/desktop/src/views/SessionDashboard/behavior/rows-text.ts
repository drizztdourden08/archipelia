/* @layer renderer-app @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';

const rowsText = (rows: readonly LogRow[]) => rows.map((row) => row.message).join('\n');

export { rowsText };
