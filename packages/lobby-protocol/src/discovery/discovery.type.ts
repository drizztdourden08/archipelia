/* @layer protocol @kind types */

type DiscoveryRecord = {
  name: string;
  id: string;
  protocol: number;
  ap: string;
  open: boolean;
};

type DiscoveryBeacon = DiscoveryRecord & { port: number };

type DiscoveryFailure = 'too-large' | 'not-json' | 'wrong-app' | 'malformed';

type DiscoveryParse<T extends DiscoveryRecord> =
  | { ok: true; record: T; compatible: boolean }
  | { ok: false; reason: DiscoveryFailure; detail: string };

export type { DiscoveryBeacon, DiscoveryFailure, DiscoveryParse, DiscoveryRecord };
