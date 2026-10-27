/* @layer renderer-app @kind types */
type RunChip = { text: string; recorded: boolean };

type PlayerRow = { slot: number; name: string; game: string; origin: string; client: string; trust: string };

type SourceLink = { name: string; sessionId: string | null };

export type { PlayerRow, RunChip, SourceLink };
