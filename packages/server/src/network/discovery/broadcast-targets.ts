/* @layer core @kind logic */
import { isIPv4 } from 'node:net';
import type { LanInterface } from '../ports/network-ports.type';
import { ipv4ToNumber } from '../address/ipv4-to-number';
import { numberToIpv4 } from '../address/number-to-ipv4';
import { LIMITED_BROADCAST } from './network-discovery.constants';

const broadcastOf = ({ address, netmask }: LanInterface): string | null => {
  if (!isIPv4(address) || !isIPv4(netmask)) return null;
  return numberToIpv4((ipv4ToNumber(address) | ~ipv4ToNumber(netmask)) >>> 0);
};

const broadcastTargets = (interfaces: LanInterface[]): string[] => [
  ...new Set([...interfaces.map(broadcastOf).filter((address): address is string => address !== null), LIMITED_BROADCAST]),
];

export { broadcastTargets };
