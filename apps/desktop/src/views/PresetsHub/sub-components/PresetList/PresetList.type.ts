/* @layer renderer-app @kind types */
import type { PresetGroup } from '../../PresetsHub.type';

type PresetListProps = {
  groups: PresetGroup[];
  total: number;
  selectedId: string | null;
  loading: boolean;
  error: string | null;
  canCreate: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onOpenGames: () => void;
};

export type { PresetListProps };
