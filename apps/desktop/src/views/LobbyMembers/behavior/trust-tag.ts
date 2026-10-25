/* @layer renderer-app @kind logic */
import type { AdminLobbyMember } from '@archipelia/model';
import { TRUST_TAGS } from '../LobbyDetail.constants';
import type { TrustTag } from '../LobbyDetail.type';

const trustTag = (member: AdminLobbyMember): TrustTag => TRUST_TAGS[member.trust];

export { trustTag };
