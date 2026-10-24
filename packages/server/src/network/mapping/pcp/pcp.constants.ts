/* @layer core @kind config */
const PCP_VERSION = 2;
const OP_MAP = 1;
const RESPONSE_BIT = 0x80;
const PROTOCOL_TCP = 6;
const PROTOCOL_UDP = 17;
const HEADER_BYTES = 24;
const PACKET_BYTES = 60;
const NONCE_BYTES = 12;
const NATPMP_VERSION = 0;
const NATPMP_FAULT_BYTES = 8;
const UNSUPPORTED_VERSION = 1;
const PCP_NO_ANSWER = 'no router answered the PCP request';
const MAPPED_PREFIX_AT = 18;
const CLIENT_ADDRESS_AT = 20;
const NONCE_AT = 24;
const PROTOCOL_AT = 36;
const INTERNAL_PORT_AT = 40;
const EXTERNAL_PORT_AT = 42;
const EXTERNAL_ADDRESS_AT = 44;
const MAPPED_PREFIX_BYTES = 10;
const MAPPED_MARKER = 0xffff;

const PCP_RESULTS: Record<number, string> = {
  1: 'the router does not speak PCP version 2',
  2: 'the router refused the mapping',
  3: 'the router found the request malformed',
  4: 'the router does not support port mapping',
  7: 'the router reports a network failure',
  8: 'the router has no mapping slots left',
  9: 'the router does not support this protocol',
  10: 'the router limits the mappings of this computer',
  11: 'the router cannot provide an external address',
  12: 'the router sees another address for this computer',
};

export {
  CLIENT_ADDRESS_AT,
  EXTERNAL_ADDRESS_AT,
  EXTERNAL_PORT_AT,
  HEADER_BYTES,
  INTERNAL_PORT_AT,
  MAPPED_MARKER,
  MAPPED_PREFIX_AT,
  MAPPED_PREFIX_BYTES,
  NATPMP_FAULT_BYTES,
  NATPMP_VERSION,
  NONCE_AT,
  NONCE_BYTES,
  OP_MAP,
  PACKET_BYTES,
  PCP_NO_ANSWER,
  PCP_RESULTS,
  PCP_VERSION,
  PROTOCOL_AT,
  PROTOCOL_TCP,
  PROTOCOL_UDP,
  RESPONSE_BIT,
  UNSUPPORTED_VERSION,
};
