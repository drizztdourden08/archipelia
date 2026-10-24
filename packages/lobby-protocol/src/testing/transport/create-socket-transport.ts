/* @layer testing @kind logic */
import type { Duplex } from 'node:stream';
import type { Transport, WebSocketFrame } from './transport.type';
import { createChannel } from './create-channel';
import { createFrameReader } from './create-frame-reader';
import { createMessageAssembler } from './create-message-assembler';
import { encodeFrame } from './encode-frame';
import { ABNORMAL_CODE, NO_STATUS_CODE, OPCODES, TOO_BIG_CODE } from './websocket.constants';

const closePayload = (code: number): Buffer => {
  const payload = Buffer.alloc(2);
  payload.writeUInt16BE(code, 0);
  return payload;
};

const createSocketTransport = (socket: Duplex): Transport => {
  const channel = createChannel();
  const assemble = createMessageAssembler();
  let finished = false;

  const finish = (code: number) => {
    if (finished) return;
    finished = true;
    channel.emit({ kind: 'close', code });
  };

  const close = (code = 1000) => {
    if (finished) return;
    socket.write(encodeFrame(OPCODES.close, closePayload(code)));
    socket.end();
    finish(code);
  };

  const onFrame = (frame: WebSocketFrame) => {
    if (frame.opcode === OPCODES.ping) socket.write(encodeFrame(OPCODES.pong, frame.payload));
    else if (frame.opcode === OPCODES.close) {
      const code = frame.payload.length >= 2 ? frame.payload.readUInt16BE(0) : NO_STATUS_CODE;
      close(code);
    } else if (frame.opcode !== OPCODES.pong) {
      const event = assemble(frame);
      if (event) channel.emit(event);
    }
  };

  const read = createFrameReader(onFrame);
  socket.on('data', (chunk: Buffer) => {
    try {
      read(chunk);
    } catch {
      close(TOO_BIG_CODE);
    }
  });
  socket.on('error', () => finish(ABNORMAL_CODE));
  socket.on('close', () => finish(ABNORMAL_CODE));

  return {
    send: (text) => {
      if (!finished) socket.write(encodeFrame(OPCODES.text, Buffer.from(text, 'utf8')));
    },
    sendBinary: (bytes) => {
      if (!finished) socket.write(encodeFrame(OPCODES.binary, bytes));
    },
    close,
    listen: channel.listen,
  };
};

export { createSocketTransport };
