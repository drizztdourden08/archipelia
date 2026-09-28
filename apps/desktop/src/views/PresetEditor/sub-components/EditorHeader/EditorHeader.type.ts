/* @layer renderer-app @kind types */
type EditorHeaderProps = {
  name: string;
  onNameChange: (name: string) => void;
  gameLabel: string;
  canSave: boolean;
  busy: boolean;
  dirty: boolean;
  onSave: () => void;
  onResetAll: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onImport: () => void;
  onExport: () => void;
};

export type { EditorHeaderProps };
