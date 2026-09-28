/* @layer renderer-app @kind logic */
import { LOG_TAIL } from '../RunProgress.constants';

const tailLines = (text: string | null, count = LOG_TAIL) =>
  (text ? text.split(/\r?\n/).filter((line) => line.trim()).slice(-count) : []);

export { tailLines };
