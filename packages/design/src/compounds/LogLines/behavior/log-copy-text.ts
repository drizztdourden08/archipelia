/* @layer renderer-app @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';

const lineOf = (row: LogRow): string => {
  const gutter = row.kind === 'text' ? '' : row.gutter;
  const tag = row.tag ? `[${row.tag}]` : '';
  return [gutter, tag, row.message].filter(Boolean).join(' ');
};

const logCopyText = (shown: readonly LogRow[]): string => shown.map(lineOf).join('\n');

export { logCopyText };
