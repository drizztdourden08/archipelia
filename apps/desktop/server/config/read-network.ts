/* @layer server @kind logic */
import { isNetworkMode, NETWORK_MODES } from '@archipelia/server/network';
import type { NetworkMode } from '@archipelia/server/network';
import { ConfigProblem } from './config-problem';

const readNetwork = (key: string, value: unknown): NetworkMode => {
  const mode = typeof value === 'string' ? value.trim().toLowerCase() : value;
  if (!isNetworkMode(mode)) throw new ConfigProblem(key, `${String(value)} is not one of ${NETWORK_MODES.join(', ')}`);
  return mode;
};

export { readNetwork };
