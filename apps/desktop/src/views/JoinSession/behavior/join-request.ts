/* @layer renderer-app @kind logic */
import type { JoinRequest } from '../../../joins/joins.type';
import { DEFAULTS_VALUE, YAML_VALUE } from '../JoinSession.constants';
import type { JoinTarget, PlayerDraft } from '../JoinSession.type';

const joinRequest = (target: JoinTarget, draft: PlayerDraft): JoinRequest => ({
  address: target.address.trim(),
  code: target.code.trim(),
  displayName: draft.displayName.trim(),
  slotName: draft.slotName.trim(),
  game: draft.game,
  source: draft.source === YAML_VALUE && draft.file ? { kind: 'yaml', ...draft.file } : { kind: 'preset', presetId: draft.source === DEFAULTS_VALUE ? '' : draft.source },
});

export { joinRequest };
