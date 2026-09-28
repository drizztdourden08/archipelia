/* @layer electron-main @kind logic */
import { networkInterfaces } from 'node:os';
import { LOOPBACK } from './lan-address.constants';

const lanAddress = () =>
  Object.values(networkInterfaces())
    .flat()
    .find((net) => net?.family === 'IPv4' && !net.internal)?.address ?? LOOPBACK;

export { lanAddress };
