/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';

const totalsOf = (parsed: unknown): Record<string, number> | undefined => {
  if (!isRecord(parsed) || !Array.isArray(parsed.placements)) return undefined;
  const totals: Record<string, number> = {};
  (parsed.placements as unknown[]).forEach((placement) => {
    if (!isRecord(placement) || typeof placement.finder !== 'string') return;
    totals[placement.finder] = (totals[placement.finder] ?? 0) + 1;
  });
  return totals;
};

export { totalsOf };
