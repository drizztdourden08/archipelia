/* @layer tooling-scripts @kind logic */
import { run } from './run.mjs';

const PACKAGE_LINE = /^[A-Za-z0-9][A-Za-z0-9._-]*\s*(==|@)/;

const freezePackages = async (python, signal) => {
  const lines = [];
  await run(python, ['-m', 'pip', 'freeze', '--disable-pip-version-check'], { onLine: (line) => lines.push(line), signal });
  return lines.filter((line) => PACKAGE_LINE.test(line)).sort((a, b) => a.localeCompare(b));
};

export { freezePackages };
