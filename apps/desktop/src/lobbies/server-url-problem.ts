/* @layer renderer-app @kind logic */
import { NOT_AN_ADDRESS, PLAIN_REMOTE } from './lobbies.constants';
import { parseServerUrl } from './parse-server-url';

const serverUrlProblem = (value: string): string | null => {
  if (parseServerUrl(value)) return null;
  return /^ws:\/\//i.test(value.trim()) && parseServerUrl(value.trim().replace(/^ws:/i, 'wss:')) ? PLAIN_REMOTE : NOT_AN_ADDRESS;
};

export { serverUrlProblem };
