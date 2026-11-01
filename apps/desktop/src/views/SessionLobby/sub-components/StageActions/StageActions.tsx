/* @layer renderer-app @kind component */
import { Button, Icon } from '@drizztdourden08/tessera/primitives';
import { LOBBY_SCREEN } from '../../SessionLobby.constants';
import type { StageActionsProps } from './StageActions.type';

const StageActions = ({ live, busy, action, reasonId, onClose }: StageActionsProps) => (
  <>
    {live && <Button variant="secondary" icon={<Icon name="square" />} disabled={busy} onClick={onClose}>{LOBBY_SCREEN.close}</Button>}
    <Button
      variant="primary"
      fill="gradient"
      icon={<Icon name="play" />}
      disabled={busy || action.reason !== undefined}
      aria-describedby={action.reason && reasonId}
      onClick={action.onClick}
    >
      {action.label}
    </Button>
  </>
);

export { StageActions };
