/* @layer testing @kind logic */
import { FIN, SIXTEEN_BIT, SIXTEEN_BIT_MAX, SIXTY_FOUR_BIT } from './encode-frame.constants';

const headerFor = (opcode: number, length: number): Buffer => {
  if (length < SIXTEEN_BIT) return Buffer.from([FIN | opcode, length]);
  if (length <= SIXTEEN_BIT_MAX) {
    const header = Buffer.alloc(4);
    header.writeUInt8(FIN | opcode, 0);
    header.writeUInt8(SIXTEEN_BIT, 1);
    header.writeUInt16BE(length, 2);
    return header;
  }
  const header = Buffer.alloc(10);
  header.writeUInt8(FIN | opcode, 0);
  header.writeUInt8(SIXTY_FOUR_BIT, 1);
  header.writeBigUInt64BE(BigInt(length), 2);
  return header;
};

const encodeFrame = (opcode: number, payload: Uint8Array): Buffer =>
  Buffer.concat([headerFor(opcode, payload.length), payload]);

export { encodeFrame };
