/* @layer renderer-app @kind component */
import { LobbySeat } from '@archipelia/design';
import { useGameArt } from '../../../../hooks/useGameArt';
import { MEMBER_TEXT } from '../../LobbyMembers.constants';
import { memberMeta } from '../../behavior/member-meta';
import { memberSeatActions } from '../../behavior/member-seat-actions';
import { memberStatus } from '../../behavior/member-status';
import type { MemberSeatProps } from './MemberSeat.type';

const MemberSeat = ({ lobby, member, model }: MemberSeatProps) => {
  const pending = member.admission === 'pending';
  const game = member.slots[0]?.game;
  const art = useGameArt(game);
  return (
    <LobbySeat
      state={pending ? 'attention' : 'filled'}
      name={member.displayName}
      game={game}
      art={art}
      meta={memberMeta(member)}
      status={pending ? undefined : memberStatus(member)}
      reason={pending ? MEMBER_TEXT.pending : undefined}
      actions={memberSeatActions(lobby, member, model)}
    />
  );
};

export { MemberSeat };
