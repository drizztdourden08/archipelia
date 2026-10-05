/* @layer renderer-app @kind logic */
import type { OptionDef, OptionValue } from '@archipelia/model';
import type { KeyValueKind } from '@drizztdourden08/tessera/composites';
import { isLoose } from './is-loose';

const entriesOf = (value: unknown): unknown[] => (isLoose(value) ? Object.values(value) : []);

const dictValueKind = (def: OptionDef, value: OptionValue): KeyValueKind | undefined => {
  if (!isLoose(value)) return undefined;
  const sample = [...entriesOf(value), ...entriesOf(def.default)];
  if (!sample.length) return undefined;
  if (sample.every((entry) => typeof entry === 'number')) return 'number';
  return sample.every((entry) => typeof entry === 'string') ? 'text' : undefined;
};

export { dictValueKind };
