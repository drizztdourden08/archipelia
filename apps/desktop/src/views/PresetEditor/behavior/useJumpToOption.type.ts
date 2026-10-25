/* @layer renderer-app @kind types */
import type { GameSchema, OptionDef } from '@archipelia/model';
import type { OptionFilter } from '../PresetEditor.type';

type JumpParams = {
  schema: GameSchema;
  filter: OptionFilter;
  visible: readonly OptionDef[];
  setTab: (tab: string) => void;
  setQuery: (query: string) => void;
  setShowAdvanced: (shown: boolean) => void;
};

export type { JumpParams };
