/* @layer renderer-app @kind logic */
import type { FieldDescriptor } from '@drizztdourden08/tessera/data';

const numberDescriptor = (path: string, label: string): FieldDescriptor => ({ path, label, kind: 'number', optional: false });

export { numberDescriptor };
