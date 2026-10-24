/* @layer core @kind logic */
import { readFileSync } from 'node:fs';
import { LOADAVG_FILE } from './sandbox.constants';

const taskCount = (file: string = LOADAVG_FILE): number | undefined => {
  try {
    const total = Number(readFileSync(file, 'utf8').split(' ')[3]?.split('/')[1]);
    return Number.isInteger(total) && total > 0 ? total : undefined;
  } catch {
    return undefined;
  }
};

export { taskCount };
