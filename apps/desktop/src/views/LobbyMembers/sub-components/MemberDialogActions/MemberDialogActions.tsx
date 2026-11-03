/* @layer renderer-app @kind component */
import { Button, Flex } from '@drizztdourden08/tessera/primitives';
import { MEMBER_TEXT, OPTION_TEXT } from '../../LobbyMembers.constants';
import { memberActions } from '../../behavior/member-actions';
import type { MemberDialogActionsProps } from './MemberDialogActions.type';

const MemberDialogActions = ({ lobby, member, model }: MemberDialogActionsProps) => {
  const can = memberActions(lobby, member);
  const answer = (run: (memberId: string) => Promise<unknown>) => () => {
    void run(member.id);
    model.closeOptions();
  };
  if (!can.approve) {
    return <Flex gap="sm" justify="end" wrap><Button variant="secondary" onClick={model.closeOptions}>{OPTION_TEXT.close}</Button></Flex>;
  }
  return (
    <Flex gap="sm" justify="end" wrap>
      <Button variant="secondary" disabled={model.isBusy()} onClick={answer(model.refuse)}>{MEMBER_TEXT.refuse}</Button>
      <Button variant="primary" disabled={model.isBusy()} onClick={answer(model.approve)}>{MEMBER_TEXT.approve}</Button>
    </Flex>
  );
};

export { MemberDialogActions };
