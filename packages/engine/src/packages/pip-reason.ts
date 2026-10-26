/* @layer core @kind logic */
import { PIP_ERROR } from './install-packages.constants';
import { stripPaths } from './strip-paths';

const pipReason = (lines: string[], code: number): string => {
  const errors = lines.filter((line) => PIP_ERROR.test(line));
  const last = (errors.at(-1) ?? lines.filter((line) => line.trim() !== '').at(-1))?.replace(PIP_ERROR, '').trim();
  return last === undefined || last === '' ? `pip exited ${code}` : stripPaths(last);
};

export { pipReason };
