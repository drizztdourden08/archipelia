/* @layer renderer-app @kind logic */
import type { GamePreset, SetPlayer } from '@archipelia/model';
import { SEAT_TEXT } from '../SessionLobby.constants';
import type { OwnSeat } from '../SessionLobby.type';
import { overridesOf } from './overrides-of';
import { SLOT_TEXT } from './slot.constants';

const profileLine = (player: SetPlayer, presets: readonly GamePreset[]): string => {
  if (player.source.kind === 'yaml') return `${SLOT_TEXT.importedFile} ${player.source.fileName}`;
  const { presetId } = player.source;
  const preset = presets.find((entry) => entry.id === presetId);
  if (!preset) return SEAT_TEXT.noPreset;
  const count = Object.keys(overridesOf(player)).length;
  const changes = count > 0 ? ` · ${SLOT_TEXT.changes(count)}` : '';
  return `${SLOT_TEXT.profile} ${preset.name}${changes}`;
};

const setMeta = (player: SetPlayer, kind: OwnSeat['kind'], presets: readonly GamePreset[], ready: boolean): string[] => {
  const head = [`${SLOT_TEXT.slot} ${player.slot}`, player.game || SLOT_TEXT.noGame];
  if (kind === 'added') head.push(SLOT_TEXT.addedHere);
  return [head.join(' · '), ready ? profileLine(player, presets) : SLOT_TEXT.setItUp];
};

const seatMetaOf = ({ slot, player, kind }: OwnSeat, presets: readonly GamePreset[], ready = true): string[] => {
  if (player.kind === 'direct') return [`${SLOT_TEXT.slot} ${slot} · ${SLOT_TEXT.anyGame}`, SLOT_TEXT.openMeta];
  return setMeta(player, kind, presets, ready);
};

export { seatMetaOf };
