/* @layer server @kind logic */
import { USAGE } from '../cli.constants';
import type { CliCommand } from '../cli.type';

const helpCommand: CliCommand = (_command, { out }) => {
  USAGE.forEach(out);
  return Promise.resolve(0);
};

export { helpCommand };
