/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { SessionPlayer } from '@archipelia/model';

type PlayerRowActions = {
  edit: (slot: number) => void;
  direct: (slot: number, on: boolean) => void;
  duplicate: (slot: number) => void;
  remove: (slot: number) => void;
};

type PlayerRowProps = {
  player: SessionPlayer;
  index: number;
  summary: string;
  problem?: string;
  open: boolean;
  busy: boolean;
  on: PlayerRowActions;
  children?: ReactNode;
};

export type { PlayerRowActions, PlayerRowProps };
