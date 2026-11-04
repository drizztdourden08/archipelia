/* @layer renderer-app @kind logic */
import type { FieldDescriptor } from '@drizztdourden08/tessera/data';

const choiceField = (path: string, label: string, values: Iterable<string>): FieldDescriptor => ({
  path,
  label,
  kind: 'enum',
  optional: false,
  closed: true,
  options: [...new Set(values)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
});

export { choiceField };
