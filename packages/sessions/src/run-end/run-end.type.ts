/* @layer core @kind types */
import type { RunEndReason, RunPlayer } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';

type SeenSpan = { first: number; last: number };

type RunTally = {
  startedAt?: number;
  lastAt: number;
  checks: Record<string, number>;
  goals: Record<string, number>;
  seen: Record<string, SeenSpan>;
  online: Record<string, boolean>;
};

type RunEndInput = {
  players: readonly RunPlayer[];
  endedAt: number;
  reason: RunEndReason;
  tally?: RunTally;
  lines?: readonly HostLogLine[];
  totals?: Readonly<Record<string, number>>;
};

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

type TallyState = {
  startedAt?: number;
  lastAt: number;
  names: readonly string[];
  entries: Map<string, Set<string>>;
  clients: Map<string, number>;
  goals: Record<string, number>;
  seen: Record<string, SeenSpan>;
};

type LiveTally = {
  add: (line: HostLogLine) => void;
  snapshot: () => RunTally;
  flush: () => Promise<void>;
};

export type { LiveTally, RunEndInput, RunTally, SlotFacts, TallyState };
