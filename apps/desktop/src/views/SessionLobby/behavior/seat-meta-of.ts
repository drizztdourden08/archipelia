/* @layer renderer-app @kind logic */
import type { GamePreset, SessionPlayer } from '@archipelia/model';
import { SEAT_TEXT } from '../SessionLobby.constants';
import type { OwnSeat } from '../SessionLobby.type';
import { gameOf } from './game-of';

const sourceLine = (player: SessionPlayer, presets: readonly GamePreset[]): string => {
  if (player.kind === 'direct') return SEAT_TEXT.noPreset;
  if (player.source.kind === 'yaml') return `${SEAT_TEXT.fromFile} ${player.source.fileName}`;
  const { presetId } = player.source;
  const preset = presets.find((entry) => entry.id === presetId);
  return preset ? `${SEAT_TEXT.preset} ${preset.name}` : SEAT_TEXT.noPreset;
};

const seatMetaOf = ({ slot, player, kind }: OwnSeat, presets: readonly GamePreset[]): string[] => [
  [`${SEAT_TEXT.slot} ${slot}`, gameOf(player) ?? SEAT_TEXT.ownGame, kind === 'added' ? SEAT_TEXT.added : SEAT_TEXT.saved].join(' · '),
  sourceLine(player, presets),
];

export { seatMetaOf };
