/* @layer renderer-app @kind logic */
import type { LobbySeatAction } from '@archipelia/design';
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import { MEMBER_TEXT } from '../LobbyMembers.constants';
import type { LobbyMembersModel } from '../LobbyMembers.type';
import { memberActions } from './member-actions';
import { pendingWorlds } from './pending-worlds';

const memberSeatActions = (lobby: AdminLobby, member: AdminLobbyMember, model: LobbyMembersModel): LobbySeatAction[] => {
  const can = memberActions(lobby, member);
  const disabled = model.isBusy();
  const name = member.displayName;
  const worlds = pendingWorlds(lobby, member).map((request): LobbySeatAction => ({
    id: `world-${request.slot.name}`, label: MEMBER_TEXT.review, nameSuffix: request.slot.name, icon: 'shield-alert', primary: true, disabled, onSelect: () => model.review(request),
  }));
  return [
    ...(can.approve ? [{ id: 'approve', label: MEMBER_TEXT.approve, nameSuffix: name, icon: 'check' as const, primary: true, disabled, onSelect: () => void model.approve(member.id) }] : []),
    ...worlds,
    ...(can.refuse ? [{ id: 'refuse', label: MEMBER_TEXT.refuse, nameSuffix: name, disabled, onSelect: () => void model.refuse(member.id) }] : []),
    ...(can.remove ? [{ id: 'remove', label: MEMBER_TEXT.remove, nameSuffix: name, disabled, onSelect: () => model.remove(member) }] : []),
  ];
};

export { memberSeatActions };
