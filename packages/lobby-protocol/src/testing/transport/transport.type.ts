/* @layer testing @kind types */
import type { Transport } from '../../node/transport/transport.type';

type WebSocketListener = { port: number; url: string; stop: () => Promise<void> };

type ListenOptions = { port?: number; host?: string; onConnection: (transport: Transport) => void };

export type { ListenOptions, WebSocketListener };
