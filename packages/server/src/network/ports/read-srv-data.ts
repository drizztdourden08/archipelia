/* @layer core @kind logic */
import { MDNS_MAX_NAME } from './mdns-limits.constants';

const readSrvData = (data: unknown): { port: number; target: string } | null => {
  if (typeof data !== 'object' || data === null) return null;
  const { port, target } = data as { port?: unknown; target?: unknown };
  if (typeof port !== 'number' || typeof target !== 'string' || target.length > MDNS_MAX_NAME) return null;
  return { port, target };
};

export { readSrvData };
