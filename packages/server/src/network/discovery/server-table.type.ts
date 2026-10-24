/* @layer core @kind types */
import type { DiscoveryRecord } from '@archipelia/lobby-protocol';
import type { DiscoverySource, LanServer } from './browse.type';

type Sighting = { record: DiscoveryRecord; host: string; port: number; compatible: boolean };

type TableEntry = Sighting & { expires: Partial<Record<DiscoverySource, number>> };

type ServerTableOptions = {
  now: () => number;
  onChange?: (servers: LanServer[]) => void;
};

export type { ServerTableOptions, Sighting, TableEntry };
