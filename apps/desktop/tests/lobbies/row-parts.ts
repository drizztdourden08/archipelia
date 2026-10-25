/* @layer tests @kind test */
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';

const inputOf = (row: SettingsSectionRow | undefined) => (row && 'input' in row ? row.input : undefined);

export { inputOf };
