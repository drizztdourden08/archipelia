/* @layer renderer-app @kind types */
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { SEAT_TINTS } from './LobbySeat.constants';

type LobbySeatState = 'filled' | 'held' | 'attention';

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

type LobbySeatProps = {
  state: LobbySeatState;
  name: string;
  game?: string;
  art?: string;
  meta?: readonly string[];
  status?: LobbySeatStatus;
  reason?: string;
  actions?: readonly LobbySeatAction[];
  tools?: readonly LobbySeatAction[];
  selected?: boolean;
  onOpen?: () => void;
};

type SeatTint = (typeof SEAT_TINTS)[number];

type ArtFit = 'pending' | 'fits' | 'off';

export type { ArtFit, LobbySeatAction, LobbySeatProps, LobbySeatState, LobbySeatStatus, LobbySeatTone, SeatTint };
