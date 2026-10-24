/* @layer core @kind logic */
import { EXTERNAL_ADDRESS_AT, MAPPED_MARKER, MAPPED_PREFIX_BYTES } from './pcp.constants';

const readPcpAddress = (view: DataView): string | null => {
  const prefix = Array.from({ length: MAPPED_PREFIX_BYTES }, (_, index) => view.getUint8(EXTERNAL_ADDRESS_AT + index));
  if (!prefix.every((byte) => byte === 0) || view.getUint16(EXTERNAL_ADDRESS_AT + MAPPED_PREFIX_BYTES) !== MAPPED_MARKER) return null;
  const parts = [0, 1, 2, 3].map((index) => view.getUint8(EXTERNAL_ADDRESS_AT + MAPPED_PREFIX_BYTES + 2 + index));
  return parts.every((part) => part === 0) ? null : parts.join('.');
};

export { readPcpAddress };
