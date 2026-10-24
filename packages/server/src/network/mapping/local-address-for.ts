/* @layer core @kind logic */
import { isIPv4 } from 'node:net';
import type { LanInterface } from '../ports/network-ports.type';
import { ipv4ToNumber } from '../address/ipv4-to-number';
import { subnetSize } from './subnet-size';

const sameSubnet = (entry: LanInterface, gateway: string): boolean => {
  if (!isIPv4(entry.address) || !isIPv4(entry.netmask)) return false;
  const hosts = subnetSize(entry.netmask);
  return Math.floor(ipv4ToNumber(entry.address) / hosts) === Math.floor(ipv4ToNumber(gateway) / hosts);
};

const localAddressFor = (interfaces: LanInterface[], gateway: string): string | null =>
  interfaces.find((entry) => sameSubnet(entry, gateway))?.address ?? null;

export { localAddressFor };
