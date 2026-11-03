/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { toast } from '@drizztdourden08/brock-react';
import { logFailure } from '../../../hooks/log-failure';
import { useRunsStore } from '../../../stores/useRunsStore';
import { confirmCommand } from './confirm-command';
import type { ConfirmCommand } from './player-command-groups.type';
import { RUN_STAGE_TEXT } from './run-stage.constants';

const failed = (err: unknown): void => {
  logFailure(RUN_STAGE_TEXT.commandFailed, err);
  toast(RUN_STAGE_TEXT.commandFailed, { variant: 'danger' });
};

const useRoomCommand = (sessionId: string): ConfirmCommand => {
  const command = useRunsStore((state) => state.command);
  return useCallback((cmd: string, title: string, message: string) => {
    confirmCommand(title, message, () => { command(sessionId, cmd).catch(failed); });
  }, [command, sessionId]);
};

export { useRoomCommand };
