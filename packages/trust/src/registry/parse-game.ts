/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { isText } from './is-text';
import { isTextList } from './is-text-list';
import { MODULE_PATTERN } from './parse-game.constants';
import { parseRelease } from './parse-release';
import type { Parsed } from './parsed.type';
import type { RegistryGame } from './registry.type';

const parseGame = (value: unknown): Parsed<RegistryGame> => {
  if (!isRecord(value)) return { problem: 'game is not an object' };
  const { game, module, displayName, home, tags, client } = value;
  if (!isText(game)) return { problem: 'game has no name' };
  if (!isText(module) || !MODULE_PATTERN.test(module)) return { problem: `game ${game} module is not a python module name` };
  if (!isText(displayName) || !isText(home) || !isText(client) || !isTextList(tags)) {
    return { problem: `game ${game} needs displayName, home, client and tags` };
  }
  const release = parseRelease(value.release);
  if (!release) return { problem: `game ${game} release needs repo, world, manifest and bundle` };
  return { value: { game, module, displayName, home, tags, client, release } };
};

export { parseGame };
