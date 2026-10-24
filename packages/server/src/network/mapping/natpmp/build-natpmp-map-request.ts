/* @layer core @kind logic */
import type { MapProtocol } from '../mapping.type';
import { MAP_REQUEST_BYTES, NATPMP_VERSION, OP_TCP, OP_UDP } from './natpmp.constants';

const buildNatpmpMapRequest = (protocol: MapProtocol, internalPort: number, externalPort: number, lifetime: number): Uint8Array => {
  const bytes = new Uint8Array(MAP_REQUEST_BYTES);
  const view = new DataView(bytes.buffer);
  view.setUint8(0, NATPMP_VERSION);
  view.setUint8(1, protocol === 'tcp' ? OP_TCP : OP_UDP);
  view.setUint16(4, internalPort);
  view.setUint16(6, externalPort);
  view.setUint32(8, lifetime);
  return bytes;
};

export { buildNatpmpMapRequest };
