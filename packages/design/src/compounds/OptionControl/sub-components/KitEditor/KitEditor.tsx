/* @layer renderer-app @kind component */
import { resolveFieldKit } from '@drizztdourden08/tessera/field-kits';
import { Box } from '@drizztdourden08/tessera/primitives';
import type { KitEditorProps } from './KitEditor.type';

const KitEditor = ({ field, value, onChange, disabled, bounds, labelId }: KitEditorProps) => {
  const kit = resolveFieldKit(field.kind);
  if (!kit) return null;
  const { EditorControl } = kit;
  return (
    <Box role="group" aria-labelledby={labelId} className="option-control__labelled">
      <EditorControl field={field} value={value} onChange={onChange} disabled={disabled} bounds={bounds} />
    </Box>
  );
};

export { KitEditor };
