/* @layer protocol @kind logic */
import { LENGTH_MASK } from './parse-frame.constants';

const readLength = (buffer: Buffer): { length: number; offset: number } | null => {
  if (buffer.length < 2) return null;
  const marker = (buffer[1] ?? 0) & LENGTH_MASK;
  if (marker < 126) return { length: marker, offset: 2 };
  if (marker === 126) return buffer.length < 4 ? null : { length: buffer.readUInt16BE(2), offset: 4 };
  return buffer.length < 10 ? null : { length: Number(buffer.readBigUInt64BE(2)), offset: 10 };
};

export { readLength };
