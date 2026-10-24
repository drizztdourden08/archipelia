/* @layer core @kind types */
import type { InstalledGame } from '@archipelia/model';
import type { CarryResult } from './carry-worlds.type';

type RecordGuard = {
  records: InstalledGame[];
  note: (carry: CarryResult) => Promise<void>;
  restore: () => Promise<string[]>;
};

export type { RecordGuard };
