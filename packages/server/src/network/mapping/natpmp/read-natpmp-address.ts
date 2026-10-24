/* @layer core @kind logic */
import type { NatpmpAddress } from './natpmp.type';
import { ADDRESS_REPLY_BYTES, FAULT_BYTES, NATPMP_VERSION, OP_ADDRESS, RESPONSE_FLAG } from './natpmp.constants';


const readNatpmpAddress = (data: Uint8Array): NatpmpAddress | null => {
  if (data.length < FAULT_BYTES) return null;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (view.getUint8(0) !== NATPMP_VERSION || view.getUint8(1) !== RESPONSE_FLAG + OP_ADDRESS) return null;
  const code = view.getUint16(2);
  if (code !== 0) return { ok: false, code };
  if (data.length !== ADDRESS_REPLY_BYTES) return null;
  return { ok: true, address: [8, 9, 10, 11].map((at) => view.getUint8(at)).join('.') };
};

export { readNatpmpAddress };
