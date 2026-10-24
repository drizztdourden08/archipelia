/* @layer core @kind logic */
import { OCTET } from './address.constants';

const ipv4ToNumber = (address: string): number => address.split('.').reduce((total, part) => total * OCTET + Number(part), 0);

export { ipv4ToNumber };
