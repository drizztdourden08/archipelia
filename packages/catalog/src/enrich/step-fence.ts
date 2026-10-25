/* @layer core @kind logic */
import type { FenceStep } from './blocks-of.type';
import { FENCE } from './blocks-of.constants';

const stepFence = (line: string, fence: string): FenceStep => {
  const mark = FENCE.exec(line)?.[1];
  if (fence !== '') return { fence: mark?.startsWith(fence) ? '' : fence, skip: true };
  return mark ? { fence: mark.slice(0, 3), skip: true } : { fence: '', skip: false };
};

export { stepFence };
