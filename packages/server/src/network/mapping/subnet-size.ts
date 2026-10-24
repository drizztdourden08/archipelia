/* @layer core @kind logic */
import { ADDRESS_SPACE } from '../address/address.constants';
import { ipv4ToNumber } from '../address/ipv4-to-number';

const subnetSize = (netmask: string): number => ADDRESS_SPACE - ipv4ToNumber(netmask);

export { subnetSize };
