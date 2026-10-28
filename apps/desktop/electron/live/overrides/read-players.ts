/* @layer electron-main @kind logic */
import { isRecord } from '@archipelia/model';
import type { PlayerSource, SessionPlayer } from '@archipelia/model';
import { LIVE_TEXT, PLAYER_KEYS, PLAYERS_MAX, PRESET_SOURCE_KEYS, YAML_SOURCE_KEYS } from '../live.constants';
import { readRecord } from './read-record';
import { readCount } from './read-count';
import { readFlag } from './read-flag';
import { readText } from './read-text';

const readSource = (name: string, value: unknown): PlayerSource => {
  const kind = isRecord(value) ? value.kind : undefined;
  if (kind === 'yaml') {
    const given = readRecord(name, value, YAML_SOURCE_KEYS);
    return { kind, fileName: readText(`${name}.fileName`, given.fileName), yaml: readText(`${name}.yaml`, given.yaml) };
  }
  const given = readRecord(name, value, PRESET_SOURCE_KEYS);
  if (given.kind !== 'preset' || !isRecord(given.overrides)) throw new Error(LIVE_TEXT.badOverride(name));
  return { kind: 'preset', presetId: readText(`${name}.presetId`, given.presetId), overrides: given.overrides as Extract<PlayerSource, { kind: 'preset' }>['overrides'] };
};

const readPlayer = (value: unknown, index: number): SessionPlayer => {
  const name = `players[${index}]`;
  const given = readRecord(name, value, PLAYER_KEYS);
  const seat = { slot: readCount(`${name}.slot`, given.slot, PLAYERS_MAX), name: readText(`${name}.name`, given.name) };
  const direct = given.direct === undefined ? undefined : readFlag(`${name}.direct`, given.direct);
  if (given.game === undefined && given.source === undefined) {
    if (direct !== true) throw new Error(LIVE_TEXT.badOverride(name));
    return { ...seat, direct };
  }
  const player = { ...seat, game: readText(`${name}.game`, given.game), source: readSource(`${name}.source`, given.source) };
  return direct === undefined ? player : { ...player, direct };
};

const readPlayers = (value: unknown): SessionPlayer[] => {
  if (!Array.isArray(value) || value.length > PLAYERS_MAX) throw new Error(LIVE_TEXT.badOverride('players'));
  return value.map(readPlayer);
};

export { readPlayers };
