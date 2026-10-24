/* @layer testing @kind types */

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

type Channel = {
  emit: TransportHandler;
  listen: (handler: TransportHandler) => void;
};

type WebSocketFrame = { fin: boolean; opcode: number; payload: Buffer };

type ParsedFrame = { frame: WebSocketFrame; consumed: number };

type WebSocketListener = { port: number; url: string; stop: () => Promise<void> };

type ListenOptions = { port?: number; host?: string; onConnection: (transport: Transport) => void };

export type {
  Channel,
  ListenOptions,
  ParsedFrame,
  Transport,
  TransportEvent,
  TransportHandler,
  WebSocketFrame,
  WebSocketListener,
};
