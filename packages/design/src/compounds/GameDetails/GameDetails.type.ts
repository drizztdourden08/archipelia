/* @layer renderer-app @kind types */
import type { GameCardAction, GameCardKind, GameCardNote, GameCardStatus } from '../GameCard';

type GameDetailsNeed = { message: string; href?: string };

type GameDetailsProps = {
  title: string;
  kind: GameCardKind;
  kindLabel: string;
  version?: string;
  status?: GameCardStatus;
  notes: GameCardNote[];
  tags: string[];
  actions: GameCardAction[];
  markdown?: string;
  art?: string;
  busy?: string;
  error?: string;
  need?: GameDetailsNeed;
  loading?: boolean;
  onLink?: (href: string) => void;
  onClose: () => void;
};

export type { GameDetailsProps };
