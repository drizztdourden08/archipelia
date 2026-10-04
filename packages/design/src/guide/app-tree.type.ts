/* @layer renderer-app @kind types */
import type { APP_TREE } from './app-tree.constants';

type DesignPart =
  | 'GameCard' | 'HintRow' | 'LogLines' | 'OptionControl' | 'OptionField' | 'OptionFieldRow' | 'OptionGroupTabs' | 'PlayerRow'
  | 'PlayerStatusRow' | 'PresetListItem' | 'RunProgressPanel' | 'RunRow' | 'ServerOptionsForm' | 'SessionStatusBar' | 'StatCard'
  | 'TemplateRow';

declare module '@drizztdourden08/tessera' {
  interface TesseraApps {
    archipeliaDesign: { parts: DesignPart; tree: typeof APP_TREE };
  }
}

export type { DesignPart };
