/* @layer protocol @kind types */
import type { ProtocolMessage, UnknownMessage } from '../messages/message.type';
import type { Direction, Failure } from '../protocol/protocol.type';

type DecodeOptions = { direction: Direction; maxBytes: number };

type DecodeOutcome =
  | { ok: true; known: true; message: ProtocolMessage }
  | { ok: true; known: false; message: UnknownMessage }
  | { ok: false; failure: Failure };

type ErrorContext = { re?: number; welcomed: boolean };

export type { DecodeOptions, DecodeOutcome, ErrorContext };
