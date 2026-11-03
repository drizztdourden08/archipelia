/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';

type LobbyStageCode = { label: string; value: string; copyLabel: string };

type LobbyStageFact = { label: string; value: string };

type LobbyStageConfig = { label: string; facts: readonly LobbyStageFact[]; editLabel: string; onEdit: () => void };

type LobbyStageProps = {
  title: string;
  chips?: ReactNode;
  actions?: ReactNode;
  code?: LobbyStageCode;
  note?: ReactNode;
  config?: LobbyStageConfig;
  children: ReactNode;
};

export type { LobbyStageCode, LobbyStageConfig, LobbyStageFact, LobbyStageProps };
