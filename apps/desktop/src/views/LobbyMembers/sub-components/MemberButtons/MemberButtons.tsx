/* @layer renderer-app @kind component */
import { Button, ButtonRow } from '@drizztdourden08/tessera/primitives';
import { memberActions } from '../../behavior/member-actions';
import type { MemberButtonsProps } from './MemberButtons.type';

const MemberButtons = ({ lobby, member, model }: MemberButtonsProps) => {
  const can = memberActions(lobby, member);
  const busy = model.isBusy();
  return (
    <ButtonRow>
      {can.refuse && <Button size="sm" variant="secondary" disabled={busy} onClick={() => void model.refuse(member.id)}>{`Refuse ${member.displayName}`}</Button>}
      {can.approve && <Button size="sm" variant="primary" disabled={busy} onClick={() => void model.approve(member.id)}>{`Approve ${member.displayName}`}</Button>}
      {can.remove && <Button size="sm" variant="danger" disabled={busy} onClick={() => model.remove(member)}>{`Remove ${member.displayName}`}</Button>}
    </ButtonRow>
  );
};

export { MemberButtons };
