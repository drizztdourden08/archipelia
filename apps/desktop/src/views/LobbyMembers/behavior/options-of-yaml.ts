/* @layer renderer-app @kind logic */
import { isRecord } from '@archipelia/model';
import type { GameSchema, OptionDef } from '@archipelia/model';
import { parse } from 'yaml';
import { OPTION_TEXT } from '../LobbyMembers.constants';
import type { OptionGroup, OptionsOfYaml } from '../LobbyMembers.type';
import { optionText } from './option-text';

const parsed = (text: string): unknown => {
  try {
    return parse(text);
  } catch {
    return undefined;
  }
};

const groupOrder = (schema: GameSchema | undefined, names: string[]): string[] => {
  const known = (schema?.groups ?? []).filter((name) => names.includes(name));
  return [...known, ...names.filter((name) => !known.includes(name))];
};

const optionsOfYaml = (text: string, game: string, schema?: GameSchema): OptionsOfYaml => {
  const document = parsed(text);
  if (!isRecord(document)) return { groups: [], problem: OPTION_TEXT.unreadable };
  const block = document[game];
  if (!isRecord(block) || Object.keys(block).length === 0) return { groups: [], problem: OPTION_TEXT.noOptions(game) };
  const defs = new Map<string, OptionDef>((schema?.options ?? []).map((def) => [def.key, def]));
  const fallback = schema ? OPTION_TEXT.otherGroup : OPTION_TEXT.plainGroup;
  const rows = Object.entries(block).map(([key, value]) => {
    const def = defs.get(key);
    return { group: def?.group ?? fallback, row: { key, label: def?.displayName ?? key, value: optionText(value, def) } };
  });
  const names = [...new Set(rows.map((entry) => entry.group))];
  const groups = groupOrder(schema, names.filter((name) => name !== fallback));
  if (names.includes(fallback)) groups.push(fallback);
  return { groups: groups.map((name): OptionGroup => ({ name, rows: rows.filter((entry) => entry.group === name).map((entry) => entry.row) })) };
};

export { optionsOfYaml };
