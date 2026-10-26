/* @layer renderer-app @kind types */
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { GAME_STATUS } from './GameCard.constants';

type GameCardKind = 'official' | 'community' | 'first-party' | 'file';

type GameCardStatus = keyof typeof GAME_STATUS;

type GameCardAction = {
  id: string;
  label: string;
  icon: IconName;
  onClick: () => void;
  tone?: 'danger';
  primary?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

type GameCardNote = { icon: IconName; text: string; warning?: boolean };

type GameCardProps = {
  title: string;
  kind: GameCardKind;
  kindLabel: string;
  version?: string;
  status?: GameCardStatus;
  notes: GameCardNote[];
  tags: string[];
  actions: GameCardAction[];
  art?: string;
  onOpen?: () => void;
};

export type { GameCardAction, GameCardKind, GameCardNote, GameCardProps, GameCardStatus };
