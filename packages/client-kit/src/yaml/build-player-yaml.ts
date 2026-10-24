/* @layer client-kit @kind logic */
import type { KitIssue } from '../errors/kit-issue.type';
import type { PlayerYamlInput } from './player-yaml.type';
import { createIssuesError } from '../errors/create-issues-error';
import { checkSlotName } from './check-slot-name';
import { emitYaml } from './emit/emit-yaml';
import { DEFAULT_PRE_ROLLED_KEY, TOP_LEVEL_KEYS } from './player-yaml.constants';
import { validateOptions } from './schema/validate-options';

const gameIssues = (game: string): KitIssue[] => {
  if (typeof game !== 'string' || game.trim() === '') return [{ key: 'game', code: 'bad-game', message: 'game must be a non-empty text.' }];
  if (TOP_LEVEL_KEYS.includes(game)) return [{ key: 'game', code: 'bad-game', message: `game "${game}" collides with a key of the player file.` }];
  return [];
};

const optionBlock = (input: PlayerYamlInput, issues: KitIssue[]): Record<string, unknown> => {
  const { schema, options = {}, allowUnknown, allowRoll, withDefaults } = input;
  if (schema === undefined) return { ...options };
  const checked = validateOptions({ schema, values: options, allowUnknown, allowRoll, withDefaults });
  if (checked.ok) return checked.values;
  issues.push(...checked.issues);
  return {};
};

const buildPlayerYaml = (input: PlayerYamlInput): string => {
  const { game, slotName, description, preRolled, preRolledKey = DEFAULT_PRE_ROLLED_KEY } = input;
  const issues = [...gameIssues(game), ...checkSlotName(slotName)];
  const block = optionBlock(input, issues);
  if (preRolled !== undefined) {
    if (preRolledKey in block) {
      issues.push({ key: preRolledKey, code: 'duplicate-value', message: `${preRolledKey} is given as an option and as preRolled. Give it once.` });
    }
    block[preRolledKey] = preRolled;
  }
  if (issues.length > 0) throw createIssuesError('invalid-input', 'The player YAML input is not valid:', issues);
  return emitYaml({
    name: slotName,
    ...(description === undefined ? {} : { description }),
    game,
    [game]: block,
  });
};

export { buildPlayerYaml };
