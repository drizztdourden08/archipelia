/* @layer renderer-app @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';
import { ERROR_LINE } from '../RunProgress.constants';
import type { RunLogInput } from '../RunProgress.type';
import { tailLines } from './tail-lines';

const logRowsOf = (lines: string[], firstLine = 1): LogRow[] =>
  lines.map((message, index) => {
    const kind = ERROR_LINE.test(message) ? 'error' : 'info';
    return { id: String(firstLine + index), gutter: String(firstLine + index), tag: kind === 'error' ? 'err' : '', kind, message };
  });

const runLogRows = ({ generateText, hostLines, showLog }: RunLogInput) => {
  const lines = showLog ? tailLines(generateText, Number.MAX_SAFE_INTEGER) : tailLines(generateText);
  const total = generateText ? tailLines(generateText, Number.MAX_SAFE_INTEGER).length : 0;
  return logRowsOf([...lines, ...hostLines], showLog ? 1 : Math.max(1, total - lines.length + 1));
};

export { runLogRows };
