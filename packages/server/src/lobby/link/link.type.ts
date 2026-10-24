/* @layer core @kind types */
import type { ClientMessage, Failure, ServerMessage } from '@archipelia/lobby-protocol';
import type { Transport } from '@archipelia/lobby-protocol/node';
import type { LobbyProtocol } from '../lobby-service-api.type';
import type { LobbyLink, MemberRef } from '../lobby-service.type';
import type { createRateLimiter } from './create-rate-limiter';

type RateLimiter = ReturnType<typeof createRateLimiter>;

type KeepAlive = { ping: () => void; heardAt: () => number };

type ConnectionOptions = {
  protocol: LobbyProtocol;
  limiter: RateLimiter;
  transport: Transport;
  address: string;
  keepAlive?: KeepAlive;
};

type ConnectionState = { welcomed: boolean; ref?: MemberRef; upload?: string };

type Wire = {
  link: LobbyLink;
  send: (message: ServerMessage) => void;
  fail: (failure: Failure, re?: number) => void;
  helloArrived: () => void;
  infoAnswered: () => void;
};

type Conversation = { options: ConnectionOptions; state: ConnectionState; wire: Wire };

type MemberHandler = (conversation: Conversation, ref: MemberRef, message: ClientMessage) => Promise<ServerMessage[]>;

export type { ConnectionOptions, ConnectionState, Conversation, KeepAlive, MemberHandler, RateLimiter, Wire };
