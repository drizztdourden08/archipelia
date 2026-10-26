/* @layer renderer-app @kind types */
import type { GameCardAction, GameCardKind, GameCardNote, GameCardStatus } from '../GameCard';

type GameDetailsProps = {
  title: string;
  kind: GameCardKind;
  kindLabel: string;
  version?: string;
  status?: GameCardStatus;
  notes: GameCardNote[];
  tags: string[];
  actions: GameCardAction[];
  summary?: string;
  details?: string;
  art?: string;
  busy?: string;
  error?: string;
  loading?: boolean;
  onClose: () => void;
};

export type { GameDetailsProps };
