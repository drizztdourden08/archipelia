/* @layer electron-main @kind logic */
import { isRecord } from '@archipelia/model';
import type { PlayerSource, SessionPlayer } from '@archipelia/model';
import { LIVE_TEXT, PLAYER_KEYS, PLAYERS_MAX, PRESET_SOURCE_KEYS, YAML_SOURCE_KEYS } from '../live.constants';
import { readRecord } from './read-record';
import { readCount } from './read-count';
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
  const slot = readCount(`${name}.slot`, given.slot, PLAYERS_MAX);
  if (given.kind === 'direct') return { kind: 'direct', slot };
  if (given.kind !== 'set') throw new Error(LIVE_TEXT.badOverride(`${name}.kind`));
  return { kind: 'set', slot, name: readText(`${name}.name`, given.name), game: readText(`${name}.game`, given.game), source: readSource(`${name}.source`, given.source) };
};

const readPlayers = (value: unknown): SessionPlayer[] => {
  if (!Array.isArray(value) || value.length > PLAYERS_MAX) throw new Error(LIVE_TEXT.badOverride('players'));
  return value.map(readPlayer);
};

export { readPlayers };
