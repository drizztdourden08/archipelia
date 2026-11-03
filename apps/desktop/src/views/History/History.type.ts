/* @layer renderer-app @kind types */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

type RunChip = { text: string; recorded: boolean };

type EndFacts = { status: string; tone: StatusTone | null; checks: string; goal: string };

type PlayerRow = EndFacts & { slot: number; name: string; game: string; origin: string; client: string; trust: string };

type SourceLink = { name: string; sessionId: string | null };

export type { EndFacts, PlayerRow, RunChip, SourceLink };
