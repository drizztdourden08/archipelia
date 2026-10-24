/* @layer core @kind logic */
import { isIPv4 } from 'node:net';
import type { LanInterface } from '../ports/network-ports.type';
import { ipv4ToNumber } from '../address/ipv4-to-number';
import { numberToIpv4 } from '../address/number-to-ipv4';
import { MIN_HOSTS } from './mapping.constants';
import { subnetSize } from './subnet-size';


const candidatesOf = ({ address, netmask }: LanInterface): string[] => {
  if (!isIPv4(address) || !isIPv4(netmask)) return [];
  const hosts = subnetSize(netmask);
  if (hosts < MIN_HOSTS) return [];
  const network = Math.floor(ipv4ToNumber(address) / hosts) * hosts;
  return [network + 1, network + hosts - 2].map(numberToIpv4).filter((candidate) => candidate !== address);
};

const gatewayCandidates = (interfaces: LanInterface[]): string[] => [...new Set(interfaces.flatMap(candidatesOf))];

export { gatewayCandidates };
