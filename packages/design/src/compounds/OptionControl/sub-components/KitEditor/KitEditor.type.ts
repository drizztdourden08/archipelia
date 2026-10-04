/* @layer renderer-app @kind types */
import type { FieldDescriptor } from '@drizztdourden08/tessera/data';
import type { NumberBounds } from '@drizztdourden08/tessera/field-kits';

type KitEditorProps = {
  field: FieldDescriptor;
  value: unknown;
  onChange: (raw: unknown) => void;
  disabled?: boolean;
  bounds?: NumberBounds;
  labelId?: string;
};

export type { KitEditorProps };
