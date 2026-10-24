/* @layer testing @kind logic */
import type { WebSocketFrame } from './transport.type';
import { parseFrame } from './parse-frame';

const createFrameReader = (onFrame: (frame: WebSocketFrame) => void): ((chunk: Buffer) => void) => {
  let pending: Buffer = Buffer.alloc(0);

  return (chunk) => {
    pending = Buffer.concat([pending, chunk]);
    let parsed = parseFrame(pending);
    while (parsed !== null) {
      pending = pending.subarray(parsed.consumed);
      onFrame(parsed.frame);
      parsed = parseFrame(pending);
    }
  };
};

export { createFrameReader };
