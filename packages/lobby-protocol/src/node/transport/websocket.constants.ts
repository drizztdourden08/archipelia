/* @layer protocol @kind config */

const WEBSOCKET_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const OPCODES = { continuation: 0, text: 1, binary: 2, close: 8, ping: 9, pong: 10 } as const;

const MAX_FRAME_BYTES = 16 * 1024 * 1024;

const NO_STATUS_CODE = 1005;
const ABNORMAL_CODE = 1006;
const TOO_BIG_CODE = 1009;

export { ABNORMAL_CODE, MAX_FRAME_BYTES, NO_STATUS_CODE, OPCODES, TOO_BIG_CODE, WEBSOCKET_GUID };
