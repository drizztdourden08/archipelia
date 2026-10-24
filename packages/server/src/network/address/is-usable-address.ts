/* @layer core @kind logic */
import { isIPv4 } from 'node:net';
import { MULTICAST_FIRST_OCTET } from './address.constants';

const isUsableAddress = (address: string): boolean => {
  if (!isIPv4(address)) return false;
  const first = Number(address.split('.')[0]);
  return first !== 0 && first < MULTICAST_FIRST_OCTET;
};

export { isUsableAddress };
