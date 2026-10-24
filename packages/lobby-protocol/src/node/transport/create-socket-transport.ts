/* @layer protocol @kind logic */
import type { Duplex } from 'node:stream';
import type { SocketOptions, SocketTransport, WebSocketFrame } from './transport.type';
import { createChannel } from './create-channel';
import { createFrameReader } from './create-frame-reader';
import { createMessageAssembler } from './create-message-assembler';
import { encodeFrame } from './encode-frame';
import { encodeMaskedFrame } from './encode-masked-frame';
import { ABNORMAL_CODE, CLOSE_GRACE_MS, MAX_FRAME_BYTES, NO_STATUS_CODE, OPCODES, TOO_BIG_CODE } from './websocket.constants';

const closePayload = (code: number): Buffer => {
  const payload = Buffer.alloc(2);
  payload.writeUInt16BE(code, 0);
  return payload;
};

const createSocketTransport = (socket: Duplex, options: SocketOptions = {}): SocketTransport => {
  const maxMessage = options.maxMessageBytes ?? (() => MAX_FRAME_BYTES);
  const encode = options.client === true ? encodeMaskedFrame : encodeFrame;
  const channel = createChannel();
  const assemble = createMessageAssembler(maxMessage);
  let finished = false;
  let heard = Date.now();

  const finish = (code: number) => {
    if (finished) return;
    finished = true;
    channel.emit({ kind: 'close', code });
  };

  const write = (opcode: number, payload: Uint8Array) => {
    if (!finished) socket.write(encode(opcode, payload));
  };

  const close = (code = 1000) => {
    if (finished) return;
    socket.write(encode(OPCODES.close, closePayload(code)));
    socket.end();
    setTimeout(() => socket.destroy(), options.closeGraceMs ?? CLOSE_GRACE_MS).unref();
    finish(code);
  };

  const onFrame = (frame: WebSocketFrame) => {
    if (finished) return;
    heard = Date.now();
    if (frame.opcode === OPCODES.ping) socket.write(encode(OPCODES.pong, frame.payload));
    else if (frame.opcode === OPCODES.close) {
      const code = frame.payload.length >= 2 ? frame.payload.readUInt16BE(0) : NO_STATUS_CODE;
      close(code);
    } else if (frame.opcode !== OPCODES.pong) {
      const event = assemble(frame);
      if (event) channel.emit(event);
    }
  };

  const read = createFrameReader(onFrame, maxMessage);
  socket.on('data', (chunk: Buffer) => {
    if (finished) return;
    try {
      read(chunk);
    } catch {
      close(TOO_BIG_CODE);
    }
  });
  socket.on('error', () => finish(ABNORMAL_CODE));
  socket.on('close', () => finish(ABNORMAL_CODE));

  return {
    send: (text) => write(OPCODES.text, Buffer.from(text, 'utf8')),
    sendBinary: (bytes) => write(OPCODES.binary, bytes),
    close,
    listen: channel.listen,
    ping: () => write(OPCODES.ping, Buffer.alloc(0)),
    heardAt: () => heard,
    drained: () => (socket.writableNeedDrain && !finished ? new Promise<void>((resolve) => {
      socket.once('drain', resolve);
      socket.once('close', resolve);
    }) : Promise.resolve()),
  };
};

export { createSocketTransport };
