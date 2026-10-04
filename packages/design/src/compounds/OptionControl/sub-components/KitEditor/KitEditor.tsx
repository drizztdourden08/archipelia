/* @layer renderer-app @kind component */
import { resolveFieldKit } from '@drizztdourden08/tessera/field-kits';
import type { KitEditorProps } from './KitEditor.type';

const KitEditor = ({ field, value, onChange, disabled, bounds }: KitEditorProps) => {
  const kit = resolveFieldKit(field.kind);
  if (!kit) return null;
  const { EditorControl } = kit;
  return <EditorControl field={field} value={value} onChange={onChange} disabled={disabled} bounds={bounds} />;
};

export { KitEditor };
