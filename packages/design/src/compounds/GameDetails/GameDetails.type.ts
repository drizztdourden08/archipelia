/* @layer renderer-app @kind types */
import type { GameCardAction, GameCardKind, GameCardNote, GameCardStatus } from '../GameCard';

type GameDetailsNeed = { message: string; href?: string };

type GameDetailsVersion = { value: string; label: string; prerelease?: boolean; worldVersion?: string; note?: string; reason?: string };

type GameDetailsPicker = {
  options: GameDetailsVersion[];
  value?: string;
  onChange: (value: string) => void;
  note?: string;
  loading?: boolean;
};

type GameDetailsProps = {
  title: string;
  kind: GameCardKind;
  kindLabel: string;
  version?: string;
  worldVersion?: string;
  status?: GameCardStatus;
  notes: GameCardNote[];
  tags: string[];
  actions: GameCardAction[];
  markdown?: string;
  art?: string;
  verified?: boolean;
  direct?: boolean;
  prerelease?: boolean;
  busy?: string;
  error?: string;
  need?: GameDetailsNeed;
  versions?: GameDetailsPicker;
  loading?: boolean;
  onLink?: (href: string) => void;
  onClose: () => void;
};

export type { GameDetailsPicker, GameDetailsProps, GameDetailsVersion };
