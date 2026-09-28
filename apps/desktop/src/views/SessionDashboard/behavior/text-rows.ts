/* @layer renderer-app @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';

const textRows = (text: string | null): LogRow[] => {
  const lines = (text ?? '').split(/\r?\n/);
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.map((line, i) => ({ id: `t${i}`, gutter: String(i + 1), tag: '', kind: 'text', message: line }));
};

export { textRows };
