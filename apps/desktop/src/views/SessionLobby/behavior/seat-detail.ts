/* @layer renderer-app @kind logic */
import type { GamePreset, SessionPlayer } from '@archipelia/model';
import { SEAT_TEXT } from '../SessionLobby.constants';

const seatDetail = ({ game, source }: SessionPlayer, presets: readonly GamePreset[]): string => {
  if (!game) return SEAT_TEXT.ownGame;
  if (source?.kind === 'yaml') return `${game} · ${SEAT_TEXT.fromFile}`;
  const preset = source ? presets.find((entry) => entry.id === source.presetId) : undefined;
  return `${game} · ${preset?.name ?? SEAT_TEXT.noPreset}`;
};

export { seatDetail };
