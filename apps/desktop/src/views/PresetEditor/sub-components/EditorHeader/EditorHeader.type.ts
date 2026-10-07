/* @layer renderer-app @kind types */
import type { MoreActions } from '../../PresetEditor.type';

type EditorHeaderProps = MoreActions & {
  name: string;
  onNameChange: (name: string) => void;
  gameLabel: string;
};

export type { EditorHeaderProps };
