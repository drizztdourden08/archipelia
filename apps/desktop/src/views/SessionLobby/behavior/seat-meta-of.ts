/* @layer renderer-app @kind logic */
import type { GamePreset, SessionPlayer } from '@archipelia/model';
import { SEAT_TEXT } from '../SessionLobby.constants';
import type { OwnSeat } from '../SessionLobby.type';
import { gameOf } from './game-of';

const sourceLine = ({ source }: SessionPlayer, presets: readonly GamePreset[]): string => {
  if (source?.kind === 'yaml') return `${SEAT_TEXT.fromFile} ${source.fileName}`;
  const preset = source ? presets.find((entry) => entry.id === source.presetId) : undefined;
  return preset ? `${SEAT_TEXT.preset} ${preset.name}` : SEAT_TEXT.noPreset;
};

const seatMetaOf = ({ slot, player, kind }: OwnSeat, presets: readonly GamePreset[]): string[] => [
  [`${SEAT_TEXT.slot} ${slot}`, gameOf(player) ?? SEAT_TEXT.ownGame, kind === 'added' ? SEAT_TEXT.added : SEAT_TEXT.saved].join(' · '),
  sourceLine(player, presets),
];

export { seatMetaOf };
