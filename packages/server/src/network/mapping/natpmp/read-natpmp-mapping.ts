/* @layer core @kind logic */
import type { MapProtocol } from '../mapping.type';
import type { NatpmpMapping } from './natpmp.type';
import { FAULT_BYTES, MAP_REPLY_BYTES, NATPMP_VERSION, OP_TCP, OP_UDP, RESPONSE_FLAG } from './natpmp.constants';


const readNatpmpMapping = (data: Uint8Array, protocol: MapProtocol, internalPort: number): NatpmpMapping | null => {
  if (data.length < FAULT_BYTES) return null;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const op = protocol === 'tcp' ? OP_TCP : OP_UDP;
  if (view.getUint8(0) !== NATPMP_VERSION || view.getUint8(1) !== RESPONSE_FLAG + op) return null;
  const code = view.getUint16(2);
  if (code !== 0) return { ok: false, code };
  if (data.length !== MAP_REPLY_BYTES || view.getUint16(8) !== internalPort) return null;
  return { ok: true, internalPort, externalPort: view.getUint16(10), lifetime: view.getUint32(12) };
};

export { readNatpmpMapping };
