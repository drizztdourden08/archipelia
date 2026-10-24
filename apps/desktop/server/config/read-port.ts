/* @layer server @kind logic */
import { ConfigProblem } from './config-problem';
import { MAX_PORT } from './config.constants';

const readPort = (key: string, value: unknown): number => {
  const port = typeof value === 'string' && /^\d+$/.test(value.trim()) ? Number(value) : value;
  if (typeof port !== 'number' || !Number.isInteger(port) || port < 0 || port > MAX_PORT) {
    throw new ConfigProblem(key, `${String(value)} is not a port from 0 to ${MAX_PORT}`);
  }
  return port;
};

export { readPort };
