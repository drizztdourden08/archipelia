/* @layer renderer-app @kind types */
import type { RunAction } from '../../SessionLobby.type';

type StageActionsProps = { live: boolean; busy: boolean; action: RunAction; reasonId: string; onClose: () => void };

export type { StageActionsProps };
