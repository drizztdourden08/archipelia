/* @layer electron-main @kind logic */
import type { SessionOverrides } from '../../../src/live/live.type';
import { OVERRIDE_KEYS, OVERRIDES_ROOT } from '../live.constants';
import { readPlayers } from './read-players';
import { readRecord } from './read-record';
import { readDirectOverride } from './read-direct-override';
import { readFlag } from './read-flag';
import { readGeneratorOverrides } from './read-generator-overrides';
import { readServerOverrides } from './read-server-overrides';

const readers: { [K in keyof SessionOverrides]-?: (value: unknown) => SessionOverrides[K] } = {
  players: readPlayers,
  lan: (value) => readFlag('lan', value),
  direct: readDirectOverride,
  server: readServerOverrides,
  generator: readGeneratorOverrides,
};

const parseOverrides = (raw: unknown): SessionOverrides => {
  if (raw === undefined || raw === null) return {};
  const given = readRecord(OVERRIDES_ROOT, raw, OVERRIDE_KEYS);
  return Object.fromEntries(OVERRIDE_KEYS.filter((key) => given[key] !== undefined).map((key) => [key, readers[key](given[key])]));
};

export { parseOverrides };
