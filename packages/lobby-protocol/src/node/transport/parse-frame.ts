/* @layer protocol @kind logic */
import type { ParsedFrame } from './transport.type';
import { LENGTH_MASK, MASK_BIT, MASK_BYTES } from './parse-frame.constants';
import { MAX_FRAME_BYTES } from './websocket.constants';

const readLength = (buffer: Buffer): { length: number; offset: number } | null => {
  const marker = (buffer[1] ?? 0) & LENGTH_MASK;
  if (marker < 126) return { length: marker, offset: 2 };
  if (marker === 126) return buffer.length < 4 ? null : { length: buffer.readUInt16BE(2), offset: 4 };
  return buffer.length < 10 ? null : { length: Number(buffer.readBigUInt64BE(2)), offset: 10 };
};

const unmask = (payload: Buffer, mask: Buffer): Buffer => {
  const out = Buffer.from(payload);
  for (let index = 0; index < out.length; index += 1) {
    out.writeUInt8((out[index] ?? 0) ^ (mask[index % MASK_BYTES] ?? 0), index);
  }
  return out;
};

const parseFrame = (buffer: Buffer): ParsedFrame | null => {
  if (buffer.length < 2) return null;
  const sizes = readLength(buffer);
  if (sizes === null) return null;
  if (sizes.length > MAX_FRAME_BYTES) throw new Error('the frame is too large');
  const masked = ((buffer[1] ?? 0) & MASK_BIT) !== 0;
  const start = sizes.offset + (masked ? MASK_BYTES : 0);
  const end = start + sizes.length;
  if (buffer.length < end) return null;
  const raw = buffer.subarray(start, end);
  const payload = masked ? unmask(raw, buffer.subarray(sizes.offset, start)) : Buffer.from(raw);
  const first = buffer[0] ?? 0;
  return { frame: { fin: (first & 0x80) !== 0, opcode: first & 0x0f, payload }, consumed: end };
};

export { parseFrame };
