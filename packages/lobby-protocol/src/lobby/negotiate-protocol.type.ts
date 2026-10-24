/* @layer protocol @kind types */
import type { Failure } from '../protocol/protocol.type';

type Negotiation = { ok: true; version: number } | { ok: false; failure: Failure };

export type { Negotiation };
