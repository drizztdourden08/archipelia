/* @layer renderer-app @kind component */
import { SeatCard } from '@drizztdourden08/tessera/composites';
import { Text } from '@drizztdourden08/tessera/primitives';
import { MEMBER_TEXT } from '../../LobbyMembers.constants';
import { memberMeta } from '../../behavior/member-meta';
import { memberSeatActions } from '../../behavior/member-seat-actions';
import type { MemberSeatProps } from './MemberSeat.type';

const MemberSeat = ({ lobby, member, model, lead }: MemberSeatProps) => {
  const pending = member.admission === 'pending';
  return (
    <SeatCard
      state={pending ? 'attention' : 'filled'}
      name={member.displayName}
      lead={lead?.(member.slots[0]?.game)}
      meta={<Text as="span" variant="caption" tone="dim">{memberMeta(member)}</Text>}
      reason={pending ? MEMBER_TEXT.pending : undefined}
      actions={memberSeatActions(lobby, member, model)}
    />
  );
};

export { MemberSeat };
