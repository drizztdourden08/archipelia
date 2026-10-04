/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';

const rangeOf = (def: OptionDef, raw: unknown): OptionValue | undefined => {
  if (typeof raw === 'number') return raw;
  if (typeof raw !== 'string') return undefined;
  if (raw.trim() !== '' && Number.isFinite(Number(raw))) return Number(raw);
  const name = Object.keys(def.namedValues ?? {}).find((key) => key.toLowerCase() === raw.toLowerCase());
  return name ?? raw;
};

export { rangeOf };
