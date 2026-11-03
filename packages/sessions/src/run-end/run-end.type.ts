/* @layer core @kind types */
import type { RunPlayer } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';

type RunEndInput = {
  players: readonly RunPlayer[];
  lines: readonly HostLogLine[];
  endedAt: number;
  totals?: Readonly<Record<string, number>>;
};

type SeenSpan = { first: number; last: number };

type SlotFacts = {
  slot: number;
  checked: number;
  total?: number;
  goalAt?: number;
  seen?: SeenSpan;
  online: boolean;
  startedAt: number;
  endedAt: number;
};

export type { RunEndInput, SeenSpan, SlotFacts };
