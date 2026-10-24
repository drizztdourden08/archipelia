/* @layer tests @kind test */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';

const inputOf = (row: SettingsSectionRow | undefined) => (row && 'input' in row ? row.input : undefined);

const problemOf = (row: SettingsSectionRow | undefined) => (row && 'problem' in row ? row.problem : undefined);

const optionsOf = (row: SettingsSectionRow | undefined) => {
  const input = inputOf(row);
  return input && 'options' in input ? input.options : [];
};

export { inputOf, optionsOf, problemOf };
