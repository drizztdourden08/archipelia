/* @layer core @kind logic */
import { PATH_STEP_PREFIX } from './spoiler.constants';
import type { SpoilerPath } from './spoiler.type';

const parsePaths = (lines: readonly string[]): SpoilerPath[] => {
  const paths: { title: string; steps: string[] }[] = [];
  lines.forEach((line) => {
    if (line.trim() === '') return;
    const indented = /^\s/.test(line);
    const current = paths[paths.length - 1];
    if (indented && current) current.steps.push(line.replace(PATH_STEP_PREFIX, ''));
    else if (!indented) paths.push({ title: line.trim(), steps: [] });
  });
  return paths;
};

export { parsePaths };
