/* @layer protocol @kind types */

type TransportEvent =
  | { kind: 'text'; text: string }
  | { kind: 'binary'; bytes: Uint8Array }
  | { kind: 'close'; code: number };

type TransportHandler = (event: TransportEvent) => void;

type Transport = {
  send: (text: string) => void;
  sendBinary: (bytes: Uint8Array) => void;
  close: (code?: number) => void;
  listen: (handler: TransportHandler) => void;
};

type SocketTransport = Transport & { ping: () => void; heardAt: () => number; drained: () => Promise<void> };

type SocketOptions = { maxMessageBytes?: () => number; closeGraceMs?: number };

type Channel = {
  emit: TransportHandler;
  listen: (handler: TransportHandler) => void;
};

type WebSocketFrame = { fin: boolean; opcode: number; payload: Buffer };

type ParsedFrame = { frame: WebSocketFrame; consumed: number };

export type { Channel, ParsedFrame, SocketOptions, SocketTransport, Transport, TransportEvent, TransportHandler, WebSocketFrame };
