/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { LobbyStageProps } from '@archipelia/design';

type RunStageProps = { sessionId: string; children: (stage: LobbyStageProps | null) => ReactNode };

export type { RunStageProps };
