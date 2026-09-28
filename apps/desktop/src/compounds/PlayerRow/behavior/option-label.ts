/* @layer renderer-app @kind logic */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';

const optionLabel = (options: readonly SelectOption[], value: string, fallback: string) =>
  options.find((option) => option.value === value)?.label ?? fallback;

export { optionLabel };
