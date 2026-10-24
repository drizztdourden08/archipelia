/* @layer core @kind config */
const OCTET = 256;
const OCTET_SHIFTS = [3, 2, 1, 0] as const;
const ADDRESS_BITS = 32;
const ADDRESS_SPACE = 2 ** ADDRESS_BITS;
const MULTICAST_FIRST_OCTET = 224;

export { ADDRESS_BITS, ADDRESS_SPACE, MULTICAST_FIRST_OCTET, OCTET, OCTET_SHIFTS };
