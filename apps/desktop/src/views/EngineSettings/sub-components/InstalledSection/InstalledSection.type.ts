/* @layer renderer-app @kind types */
import type { InstalledEngine } from '@archipelia/model';

type InstalledSectionProps = {
  engines: readonly InstalledEngine[];
  activeId: string | undefined;
  busy: boolean;
  onSwitch: (id: string) => void;
  onRemove: (engine: InstalledEngine) => void;
};

export type { InstalledSectionProps };
