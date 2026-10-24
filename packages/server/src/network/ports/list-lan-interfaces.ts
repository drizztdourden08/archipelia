/* @layer core @kind logic */
import { networkInterfaces } from 'node:os';
import type { LanInterface } from './network-ports.type';

const listLanInterfaces = (): LanInterface[] =>
  Object.values(networkInterfaces())
    .flatMap((list) => list ?? [])
    .filter((entry) => entry.family === 'IPv4' && !entry.internal)
    .map((entry) => ({ address: entry.address, netmask: entry.netmask }));

export { listLanInterfaces };
