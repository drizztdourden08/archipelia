/* @layer core @kind types */
import type { DiscoveryParse, DiscoveryRecord } from '@archipelia/lobby-protocol';

type MdnsFound = {
  kind: 'found';
  parsed: Extract<DiscoveryParse<DiscoveryRecord>, { ok: true }>;
  host: string;
  port: number;
  ttlSeconds: number;
};

type MdnsGone = { kind: 'gone'; id: string };

type MdnsEvent = MdnsFound | MdnsGone;

type PendingInstance = {
  srv?: { port: number; target: string; ttl: number };
  txt?: { entries: string[]; ttl: number };
  id?: string;
};

export type { MdnsEvent, MdnsFound, PendingInstance };
