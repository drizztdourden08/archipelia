/* @layer electron-main @kind logic */
import { randomBytes } from 'node:crypto';
import { FIN_BIT, MASK_BIT, MASK_BYTES, SIXTEEN_BIT, SIXTEEN_BIT_MAX, SIXTY_FOUR_BIT } from './remote.constants';

const headerFor = (opcode: number, length: number): Buffer => {
  if (length < SIXTEEN_BIT) return Buffer.from([FIN_BIT | opcode, MASK_BIT | length]);
  if (length <= SIXTEEN_BIT_MAX) {
    const header = Buffer.alloc(4);
    header.writeUInt8(FIN_BIT | opcode, 0);
    header.writeUInt8(MASK_BIT | SIXTEEN_BIT, 1);
    header.writeUInt16BE(length, 2);
    return header;
  }
  const header = Buffer.alloc(10);
  header.writeUInt8(FIN_BIT | opcode, 0);
  header.writeUInt8(MASK_BIT | SIXTY_FOUR_BIT, 1);
  header.writeBigUInt64BE(BigInt(length), 2);
  return header;
};

const encodeMaskedFrame = (opcode: number, payload: Uint8Array): Buffer => {
  const mask = randomBytes(MASK_BYTES);
  const body = Buffer.from(payload);
  for (let index = 0; index < body.length; index += 1) body.writeUInt8((body[index] ?? 0) ^ (mask[index % MASK_BYTES] ?? 0), index);
  return Buffer.concat([headerFor(opcode, body.length), mask, body]);
};

export { encodeMaskedFrame };
