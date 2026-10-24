/* @layer protocol @kind logic */
import type { WebSocketFrame } from './transport.type';
import { MASK_BIT, MASK_BYTES } from './parse-frame.constants';
import { parseFrame } from './parse-frame';
import { readLength } from './read-length';
import { MAX_HEADER_BYTES } from './websocket.constants';

const frameSize = (head: Buffer, maxPayload: number): number | null => {
  const sizes = readLength(head);
  if (sizes === null) return null;
  if (sizes.length > maxPayload) throw new Error('the frame is larger than this connection takes');
  return sizes.offset + (((head[1] ?? 0) & MASK_BIT) !== 0 ? MASK_BYTES : 0) + sizes.length;
};

const createFrameReader = (onFrame: (frame: WebSocketFrame) => void, maxPayload: () => number): ((chunk: Buffer) => void) => {
  let chunks: Buffer[] = [];
  let total = 0;

  const nextFrame = (): boolean => {
    const size = frameSize(Buffer.concat(chunks, Math.min(total, MAX_HEADER_BYTES)), maxPayload());
    if (size === null || total < size) return false;
    const whole = Buffer.concat(chunks, total);
    const parsed = parseFrame(whole);
    if (parsed === null) return false;
    const rest = whole.subarray(parsed.consumed);
    chunks = rest.length > 0 ? [rest] : [];
    total = rest.length;
    onFrame(parsed.frame);
    return true;
  };

  return (chunk) => {
    chunks.push(chunk);
    total += chunk.length;
    while (total > 0 && nextFrame());
  };
};

export { createFrameReader };
