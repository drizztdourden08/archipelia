/* @layer renderer-app @kind types */
import type { useSessionBuilder } from '../../behavior/useSessionBuilder';

type RoomSettingsProps = {
  builder: ReturnType<typeof useSessionBuilder>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type { RoomSettingsProps };
