/* @layer core @kind logic */
import type { LineStep } from './blocks-of.type';
import { dropComments } from './drop-comments';

const stepComment = (raw: string, comment: boolean): LineStep => {
  let line = raw;
  if (comment) {
    const close = line.indexOf('-->');
    if (close === -1) return { line: '', comment: true };
    line = line.slice(close + 3);
  }
  line = dropComments(line);
  const open = line.indexOf('<!--');
  return open === -1 ? { line, comment: false } : { line: line.slice(0, open), comment: true };
};

export { stepComment };
