/* @layer tests @kind test */
import { PassThrough } from 'node:stream';
import { describe, expect, test } from 'vitest';
import { createSocketTransport } from '../src/node';
import { encodeFrame } from '../src/node/transport/encode-frame';
import { parseFrame } from '../src/node/transport/parse-frame';

const MASK_BIT = 0x80;
const OPCODE_PONG = 10;
const OPCODE_CLOSE = 8;
const OPCODE_PING = 9;

const collect = (socket: PassThrough) => {
  const frames: Buffer[] = [];
  socket.on('data', (chunk: Buffer) => frames.push(chunk));
  return frames;
};

describe('a transport in client mode', () => {
  test('masks every frame it writes, the pong and the close included', () => {
    const socket = new PassThrough();
    const frames = collect(socket);
    const transport = createSocketTransport(socket, { client: true });
    transport.send('hello');
    socket.write(encodeFrame(OPCODE_PING, Buffer.from('p')));
    transport.close(1000);
    const written = frames.filter((frame) => frame.length > 0);
    const [text, ...rest] = written;
    expect(text?.[1] !== undefined && (text[1] & MASK_BIT) !== 0).toBe(true);
    expect(parseFrame(text ?? Buffer.alloc(0))?.frame.payload.toString('utf8')).toBe('hello');
    const opcodes = rest.map((frame) => frame[0] !== undefined ? frame[0] & 0x0f : -1);
    expect(opcodes).toEqual(expect.arrayContaining([OPCODE_PONG, OPCODE_CLOSE]));
    for (const frame of rest.filter((entry) => [OPCODE_PONG, OPCODE_CLOSE].includes((entry[0] ?? 0) & 0x0f))) expect((frame[1] ?? 0) & MASK_BIT).toBe(MASK_BIT);
  });

  test('keeps the server frames plain', () => {
    const socket = new PassThrough();
    const frames = collect(socket);
    createSocketTransport(socket).send('hello');
    expect(((frames[0]?.[1] ?? 0) & MASK_BIT)).toBe(0);
  });
});
