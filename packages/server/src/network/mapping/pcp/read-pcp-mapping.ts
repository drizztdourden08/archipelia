/* @layer core @kind logic */
import type { MapProtocol } from '../mapping.type';
import type { PcpMapping } from './pcp.type';
import {
  EXTERNAL_PORT_AT,
  INTERNAL_PORT_AT,
  NONCE_AT,
  OP_MAP,
  PACKET_BYTES,
  PCP_VERSION,
  PROTOCOL_AT,
  PROTOCOL_TCP,
  PROTOCOL_UDP,
  RESPONSE_BIT,
} from './pcp.constants';
import { readPcpAddress } from './read-pcp-address';
import { readPcpFault } from './read-pcp-fault';

const sameBytes = (data: Uint8Array, at: number, expected: Uint8Array): boolean =>
  expected.every((byte, index) => data[at + index] === byte);

const readPcpMapping = (data: Uint8Array, nonce: Uint8Array, protocol: MapProtocol, internalPort: number): PcpMapping | null => {
  const fault = readPcpFault(data);
  if (fault) return fault;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const header = data.length === PACKET_BYTES && view.getUint8(0) === PCP_VERSION && view.getUint8(1) === RESPONSE_BIT + OP_MAP;
  const wanted = protocol === 'tcp' ? PROTOCOL_TCP : PROTOCOL_UDP;
  const ours = header && sameBytes(data, NONCE_AT, nonce) && view.getUint8(PROTOCOL_AT) === wanted && view.getUint16(INTERNAL_PORT_AT) === internalPort;
  if (!ours) return null;
  return { ok: true, externalPort: view.getUint16(EXTERNAL_PORT_AT), externalAddress: readPcpAddress(view), lifetime: view.getUint32(4) };
};

export { readPcpMapping };
