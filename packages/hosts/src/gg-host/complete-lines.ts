/* @layer core @kind logic */
import type { CompleteLines } from './complete-lines.type';

const completeLines = (text: string): CompleteLines => {
  const end = text.lastIndexOf('\n');
  if (end < 0) return { lines: [], consumed: 0 };
  const whole = text.slice(0, end + 1);
  const lines = whole.split(/\r?\n/).filter((line) => line.length > 0);
  return { lines, consumed: Buffer.byteLength(whole, 'utf8') };
};

export { completeLines };
