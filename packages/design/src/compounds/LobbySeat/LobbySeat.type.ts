/* @layer renderer-app @kind types */
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { SEAT_TINTS } from './LobbySeat.constants';

type LobbySeatState = 'filled' | 'held' | 'attention' | 'new';

type LobbySeatTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

type LobbySeatStatus = { label: string; tone: LobbySeatTone; title?: string };

type LobbySeatAction = {
  id: string;
  label: string;
  nameSuffix?: string;
  icon?: IconName;
  primary?: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

type LobbySeatSideValue = 'direct' | 'set';

type LobbySeatSide = {
  label: string;
  value?: LobbySeatSideValue;
  locked?: boolean;
  disabled?: boolean;
  onChange?: (value: LobbySeatSideValue) => void;
};

type LobbySeatProps = {
  state: LobbySeatState;
  name: string;
  game?: string;
  art?: string;
  mark?: string;
  meta?: readonly string[];
  status?: LobbySeatStatus;
  side?: LobbySeatSide;
  reason?: string;
  actions?: readonly LobbySeatAction[];
  tools?: readonly LobbySeatAction[];
  selected?: boolean;
  onOpen?: () => void;
};

type SeatTint = (typeof SEAT_TINTS)[number];

type ArtFit = 'pending' | 'fits' | 'off';

export type { ArtFit, LobbySeatAction, LobbySeatProps, LobbySeatSide, LobbySeatSideValue, LobbySeatState, LobbySeatStatus, LobbySeatTone, SeatTint };
