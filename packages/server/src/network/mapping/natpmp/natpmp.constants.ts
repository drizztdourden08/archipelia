/* @layer core @kind config */
const NATPMP_VERSION = 0;
const OP_ADDRESS = 0;
const OP_UDP = 1;
const OP_TCP = 2;
const RESPONSE_FLAG = 128;
const ADDRESS_REQUEST = new Uint8Array([NATPMP_VERSION, OP_ADDRESS]);
const ADDRESS_REPLY_BYTES = 12;
const FAULT_BYTES = 8;
const NATPMP_NO_ANSWER = 'no router answered the NAT-PMP request';
const NATPMP_UNSUPPORTED_VERSION = 1;
const MAP_REQUEST_BYTES = 12;
const MAP_REPLY_BYTES = 16;

const NATPMP_RESULTS: Record<number, string> = {
  1: 'the router does not speak NAT-PMP version 0',
  2: 'the router refused the mapping',
  3: 'the router reports a network failure',
  4: 'the router has no mapping slots left',
  5: 'the router does not support this request',
};

export {
  ADDRESS_REPLY_BYTES,
  ADDRESS_REQUEST,
  FAULT_BYTES,
  MAP_REPLY_BYTES,
  MAP_REQUEST_BYTES,
  NATPMP_NO_ANSWER,
  NATPMP_RESULTS,
  NATPMP_UNSUPPORTED_VERSION,
  NATPMP_VERSION,
  OP_ADDRESS,
  OP_TCP,
  OP_UDP,
  RESPONSE_FLAG,
};
