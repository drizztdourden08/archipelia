/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';

type LobbyStageCode = { label: string; value: string; copyLabel?: string };

type LobbyStageFact = { label: string; value: string };

type LobbyStageGames = { label: string; values: readonly string[] };

type LobbyStageConfig = {
  label: string;
  facts: readonly LobbyStageFact[];
  games?: LobbyStageGames;
  editLabel?: string;
  onEdit?: () => void;
  locked?: string;
};

type LobbyStageProps = {
  title: string;
  chips?: ReactNode;
  actions?: ReactNode;
  codes?: readonly LobbyStageCode[];
  note?: ReactNode;
  config?: LobbyStageConfig;
  children: ReactNode;
};

export type { LobbyStageCode, LobbyStageConfig, LobbyStageFact, LobbyStageGames, LobbyStageProps };
