/* @layer renderer-app @kind component */
import { Button, ButtonRow } from '@drizztdourden08/tessera/primitives';
import { FINAL_STATES, LIVE_STATES } from '../../../../joins/joins.constants';
import type { JoinCardProps } from '../../JoinSession.type';

const JoinButtons = ({ join, busy, onLeave, onResume, onDismiss }: JoinCardProps) => {
  const name = join.lobbyName ?? join.code;
  const live = LIVE_STATES.includes(join.state);
  return (
    <ButtonRow>
      {!live && !FINAL_STATES.includes(join.state) && <Button size="sm" variant="secondary" disabled={busy} onClick={() => onResume(join.id)}>{`Reconnect to ${name}`}</Button>}
      {live && <Button size="sm" variant="danger" disabled={busy} onClick={() => onLeave(join.id)}>{`Leave ${name}`}</Button>}
      {!live && <Button size="sm" variant="secondary" disabled={busy} onClick={() => onDismiss(join.id)}>{`Forget ${name}`}</Button>}
    </ButtonRow>
  );
};

export { JoinButtons };
