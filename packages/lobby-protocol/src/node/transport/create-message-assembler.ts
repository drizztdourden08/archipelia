/* @layer protocol @kind logic */
import type { TransportEvent, WebSocketFrame } from './transport.type';
import { OPCODES } from './websocket.constants';

const createMessageAssembler = (maxMessage: () => number): ((frame: WebSocketFrame) => TransportEvent | null) => {
  let parts: Buffer[] = [];
  let size = 0;
  let opcode: number = OPCODES.text;

  return (frame) => {
    if (frame.opcode !== OPCODES.continuation) {
      opcode = frame.opcode;
      parts = [];
      size = 0;
    }
    size += frame.payload.length;
    if (size > maxMessage()) throw new Error('the message is larger than this connection takes');
    parts.push(frame.payload);
    if (!frame.fin) return null;
    const whole = Buffer.concat(parts, size);
    parts = [];
    size = 0;
    if (opcode === OPCODES.text) return { kind: 'text', text: whole.toString('utf8') };
    return { kind: 'binary', bytes: new Uint8Array(whole) };
  };
};

export { createMessageAssembler };
