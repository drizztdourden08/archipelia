/* @layer renderer-app @kind types */
import type { EngineEntry } from '@archipelia/model';

type InstalledSectionProps = {
  engines: readonly EngineEntry[];
  activeId: string | undefined;
  busy: boolean;
  onSwitch: (id: string) => void;
  onRemove: (engine: EngineEntry) => void;
};

export type { InstalledSectionProps };
