/* @layer renderer-app @kind logic */
import type { ActionItem } from '@drizztdourden08/tessera/composites';
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import { MEMBER_TEXT } from '../LobbyMembers.constants';
import type { LobbyMembersModel } from '../LobbyMembers.type';
import { memberActions } from './member-actions';
import { pendingWorlds } from './pending-worlds';

const memberSeatActions = (lobby: AdminLobby, member: AdminLobbyMember, model: LobbyMembersModel): ActionItem[] => {
  const can = memberActions(lobby, member);
  const busy = model.isBusy();
  const name = member.displayName;
  const worlds = pendingWorlds(lobby, member).map((request): ActionItem => ({
    id: `world-${request.slot.name}`, label: MEMBER_TEXT.review, nameSuffix: request.slot.name, kind: 'primary', disabled: busy, onSelect: () => model.review(request),
  }));
  return [
    ...(can.refuse ? [{ id: 'refuse', label: MEMBER_TEXT.refuse, nameSuffix: name, disabled: busy, onSelect: () => void model.refuse(member.id) }] : []),
    ...(can.remove ? [{ id: 'remove', label: MEMBER_TEXT.remove, nameSuffix: name, kind: 'danger' as const, confirm: false, disabled: busy, onSelect: () => model.remove(member) }] : []),
    ...worlds,
    ...(can.approve ? [{ id: 'approve', label: MEMBER_TEXT.approve, nameSuffix: name, kind: 'primary' as const, disabled: busy, onSelect: () => void model.approve(member.id) }] : []),
  ];
};

export { memberSeatActions };
