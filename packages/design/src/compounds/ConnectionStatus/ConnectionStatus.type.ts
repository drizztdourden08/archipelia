/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { CONNECTION_STATUS } from './ConnectionStatus.constants';

type ConnectionPhase = Extract<keyof typeof CONNECTION_STATUS, string>;

type ConnectionStatusProps = {
  phase: ConnectionPhase;
  detail?: string | null;
  auth?: ReactNode;
  onRetry?: () => void;
  retryAt?: number | null;
  attempt?: number;
  attempts?: number;
  retrying?: boolean;
};

export type { ConnectionPhase, ConnectionStatusProps };
