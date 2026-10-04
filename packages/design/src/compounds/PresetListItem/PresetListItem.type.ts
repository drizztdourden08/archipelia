/* @layer renderer-app @kind types */
type PresetListItemProps = {
  id: string;
  name: string;
  meta: string;
  selected: boolean;
  unavailable?: boolean;
  onSelect: (id: string) => void;
};

export type { PresetListItemProps };
