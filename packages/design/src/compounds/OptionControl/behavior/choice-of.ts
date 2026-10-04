/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';

const choiceOf = (def: OptionDef, raw: unknown): string | undefined => {
  if (typeof raw !== 'string' && typeof raw !== 'number' && typeof raw !== 'boolean') return undefined;
  const word = String(raw).toLowerCase();
  const found = def.choices?.find((choice) => choice.value.toLowerCase() === word || choice.label.toLowerCase() === word);
  return found?.value ?? String(raw);
};

export { choiceOf };
