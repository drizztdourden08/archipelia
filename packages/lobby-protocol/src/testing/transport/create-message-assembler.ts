/* @layer testing @kind logic */
import type { TransportEvent, WebSocketFrame } from './transport.type';
import { OPCODES } from './websocket.constants';

const createMessageAssembler = (): ((frame: WebSocketFrame) => TransportEvent | null) => {
  let parts: Buffer[] = [];
  let opcode: number = OPCODES.text;

  return (frame) => {
    if (frame.opcode !== OPCODES.continuation) {
      opcode = frame.opcode;
      parts = [];
    }
    parts.push(frame.payload);
    if (!frame.fin) return null;
    const whole = Buffer.concat(parts);
    parts = [];
    if (opcode === OPCODES.text) return { kind: 'text', text: whole.toString('utf8') };
    return { kind: 'binary', bytes: new Uint8Array(whole) };
  };
};

export { createMessageAssembler };
