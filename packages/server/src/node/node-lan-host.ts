/* @layer core @kind logic */
import { networkInterfaces } from 'node:os';
import { LOOPBACK } from './node-lan-host.constants';

const nodeLanHost = (): string => {
  const found = Object.values(networkInterfaces())
    .flatMap((list) => list ?? [])
    .find((entry) => entry.family === 'IPv4' && !entry.internal);
  return found?.address ?? LOOPBACK;
};

export { nodeLanHost };
