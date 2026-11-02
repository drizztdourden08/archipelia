/* @layer tests @kind helper */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const STAMP = /^\[([^\]]+)\]/;
const PROBLEM = /\[(?:error|warn)\]/;

const rendererLogOf = (rotpDir: string, instance: string) =>
  join(rotpDir, '.claude', 'worktrees', instance, '.user-data', 'Data', 'debug', 'renderer-console.log');

const writtenSince = (line: string, since: number) => {
  const stamp = STAMP.exec(line)?.[1];
  return stamp !== undefined && Date.parse(stamp) >= since;
};

const rotpProblemsSince = async (rotpDir: string, instance: string, since: number): Promise<string[]> => {
  try {
    const lines = (await readFile(rendererLogOf(rotpDir, instance), 'utf8')).split(/\r?\n/);
    return lines.filter((line) => PROBLEM.test(line) && writtenSince(line, since));
  } catch {
    return [];
  }
};

export { rotpProblemsSince };
