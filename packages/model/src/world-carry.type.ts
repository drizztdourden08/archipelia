/* @layer core @kind types */
import type { InstalledGame } from './game.type';

type CarryProblem = { apworld: string; game: string; reason: string };

type CarryResult = { copied: string[]; reinstalled: string[]; problems: CarryProblem[]; at: number; notes?: string[] };

type RecordGuard = {
  records: InstalledGame[];
  note: (carry: CarryResult) => Promise<void>;
  restore: () => Promise<string[]>;
};

export type { CarryProblem, CarryResult, RecordGuard };
