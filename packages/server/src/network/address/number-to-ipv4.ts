/* @layer core @kind logic */
import { OCTET, OCTET_SHIFTS } from './address.constants';

const numberToIpv4 = (value: number): string => OCTET_SHIFTS.map((shift) => Math.floor(value / OCTET ** shift) % OCTET).join('.');

export { numberToIpv4 };
