/* @layer core @kind logic */
import type { PcpFault } from './pcp.type';
import { HEADER_BYTES, NATPMP_FAULT_BYTES, NATPMP_VERSION, OP_MAP, PCP_VERSION, RESPONSE_BIT, UNSUPPORTED_VERSION } from './pcp.constants';

const readPcpFault = (data: Uint8Array): PcpFault | null => {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (data.length >= NATPMP_FAULT_BYTES && view.getUint8(0) === NATPMP_VERSION && view.getUint16(2) === UNSUPPORTED_VERSION) {
    return { ok: false, code: UNSUPPORTED_VERSION };
  }
  const isPcp = data.length >= HEADER_BYTES && view.getUint8(0) === PCP_VERSION && view.getUint8(1) === RESPONSE_BIT + OP_MAP;
  return isPcp && view.getUint8(3) !== 0 ? { ok: false, code: view.getUint8(3) } : null;
};

export { readPcpFault };
