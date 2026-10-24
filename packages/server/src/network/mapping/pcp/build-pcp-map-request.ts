/* @layer core @kind logic */
import type { PcpMapRequest } from './pcp.type';
import {
  CLIENT_ADDRESS_AT,
  EXTERNAL_PORT_AT,
  INTERNAL_PORT_AT,
  MAPPED_MARKER,
  MAPPED_PREFIX_AT,
  NONCE_AT,
  OP_MAP,
  PACKET_BYTES,
  PCP_VERSION,
  PROTOCOL_AT,
  PROTOCOL_TCP,
  PROTOCOL_UDP,
} from './pcp.constants';

const buildPcpMapRequest = ({ clientAddress, nonce, protocol, internalPort, externalPort, lifetime }: PcpMapRequest): Uint8Array => {
  const bytes = new Uint8Array(PACKET_BYTES);
  const view = new DataView(bytes.buffer);
  view.setUint8(0, PCP_VERSION);
  view.setUint8(1, OP_MAP);
  view.setUint32(4, lifetime);
  view.setUint16(MAPPED_PREFIX_AT, MAPPED_MARKER);
  clientAddress.split('.').forEach((part, index) => view.setUint8(CLIENT_ADDRESS_AT + index, Number(part)));
  bytes.set(nonce, NONCE_AT);
  view.setUint8(PROTOCOL_AT, protocol === 'tcp' ? PROTOCOL_TCP : PROTOCOL_UDP);
  view.setUint16(INTERNAL_PORT_AT, internalPort);
  view.setUint16(EXTERNAL_PORT_AT, externalPort);
  return bytes;
};

export { buildPcpMapRequest };
