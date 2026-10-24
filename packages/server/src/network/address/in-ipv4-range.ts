/* @layer core @kind logic */
import { isIPv4 } from 'node:net';
import { ADDRESS_BITS } from './address.constants';
import { ipv4ToNumber } from './ipv4-to-number';

const inIpv4Range = (address: string, base: string, prefix: number): boolean => {
  if (!isIPv4(address)) return false;
  const size = 2 ** (ADDRESS_BITS - prefix);
  return Math.floor(ipv4ToNumber(address) / size) === Math.floor(ipv4ToNumber(base) / size);
};

export { inIpv4Range };
